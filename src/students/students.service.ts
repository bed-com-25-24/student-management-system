import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) { }

  async createStudent(dto: any) {
    const student = this.studentRepo.create(dto);
    return await this.studentRepo.save(student);
  }

  async findAllStudents(query?: { classId?: number }) {
    const classId = query?.classId;
    if (classId) {
      return this.studentRepo.find({ where: { classId: Number(classId) } });
    }
    return this.studentRepo.find();
  }

  async findStudentById(id: number) {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async updateStudent(id: number, dto: any) {
    await this.studentRepo.update(id, dto);
    return this.findStudentById(id);
  }

  async deleteStudent(id: number) {
    await this.studentRepo.delete(id);
    return { message: 'Student deleted' };
  }

  async getStudentGrades(studentId: number): Promise<any[]> {
    // Oracle uses positional binding (:1), not named binding
    return this.studentRepo.query(
      `SELECT * FROM "grades" WHERE "studentId" = :1`,
      [studentId],
    );
  }
}