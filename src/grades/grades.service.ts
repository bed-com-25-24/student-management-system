import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/Grade.entity';
import { CreateGradeDto } from './dto/CreateGradeDto';
import { UpdateGradeDto } from './dto/UpdateGradeDto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    const grade = this.gradesRepository.create(createGradeDto);
    return await this.gradesRepository.save(grade);
  }

  async findAll(classId?: number, term?: string): Promise<Grade[]> {
    const query = this.gradesRepository.createQueryBuilder('grade');
    if (classId) query.andWhere('grade.classId = :classId', { classId });
    if (term) query.andWhere('grade.term = :term', { term });
    return await query.getMany();
  }

  async findOne(id: number): Promise<Grade> {
    const grade = await this.gradesRepository.findOne({ where: { id } });
    if (!grade) {
      throw new NotFoundException(`Grade with id ${id} not found`);
    }
    return grade;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    const existingGrade = await this.findOne(id);
    const updated = Object.assign(existingGrade, updateGradeDto);

    return await this.gradesRepository.save(updated);
  }
  async findByStudentAndSubject(studentId: number, subjectId: number, term?: string): Promise<Grade> {
    const grade = await this.gradesRepository.findOne({
      where: term ? { studentId, subjectId, term } : { studentId, subjectId },
    });
    if (!grade) {
      throw new NotFoundException(`Grade for student ${studentId} in subject ${subjectId} not found`);
    }
    return grade;
  }

  async updateByStudentAndSubject(studentId: number, subjectId: number, updateGradeDto: UpdateGradeDto, term?: string): Promise<Grade> {
    const grade = await this.findByStudentAndSubject(studentId, subjectId, term);
    Object.assign(grade, updateGradeDto);
    return await this.gradesRepository.save(grade);
  }


  async computeFinalGrade(studentId: number, term: string): Promise<number> {
    const grades = await this.gradesRepository.find({ where: { studentId, term } });
    if (!grades.length) return 0;

    const avg = grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
    return avg;
  }

  async computeClassRanking(classId: number, term: string): Promise<any[]> {
    const grades = await this.findAll(classId, term);

    const studentScores: Record<number, number[]> = {};
    grades.forEach(g => {
      if (!studentScores[g.studentId]) studentScores[g.studentId] = [];
      studentScores[g.studentId].push(g.score);
    });

    const rankings = Object.entries(studentScores).map(([studentId, scores]) => ({
      studentId: parseInt(studentId),
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      grade: this.mapBoundary(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

    return rankings.sort((a, b) => b.average - a.average);
  }

  private mapBoundary(score: number): string {
    if (score >= 75) return 'A';
    if (score >= 65) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  }
}
