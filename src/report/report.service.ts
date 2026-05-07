import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Class } from 'src/students/entities/class.entity';
import { Student } from 'src/students/entities/student.entity';
import { Grade } from 'src/grades/entities/Grade.entity';

interface GeneratedReportInfo {
  studentId: number;
  status: string;
  message?: string;
  reportId?: number;
  average?: number;
  grade?: string;
}

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async generateFromData(classId: number, term: string) {
    const termNumber = parseInt(term);
    
    const students = await this.studentRepository.find({
      where: { classId: classId },
      relations: ['class']
    });

    if (students.length === 0) {
      throw new NotFoundException(`No students found in class ${classId}`);
    }

    const generatedReports: GeneratedReportInfo[] = [];

    for (const student of students) {
      const existingReport = await this.reportRepository.findOne({
        where: {
          studentId: student.id,
          term: termNumber
        }
      });

      if (existingReport) {
        generatedReports.push({ 
          studentId: student.id, 
          status: 'skipped', 
          message: 'Report already exists'
        });
        continue;
      }

      const grades = await this.gradeRepository.find({
        where: {
          studentId: student.id,
          term: termNumber
        }
      });

      if (grades.length === 0) {
        generatedReports.push({ 
          studentId: student.id, 
          status: 'skipped', 
          message: 'No grades found'
        });
        continue;
      }

      const total = grades.reduce((sum, grade) => sum + (grade.score || 0), 0);
      const average = total / grades.length;
      const gradeLetter = this.getGradeLetter(average);

      const createReportDto = new CreateReportDto();
      createReportDto.total = total;
      createReportDto.term = termNumber;
      createReportDto.average = parseFloat(average.toFixed(2));
      createReportDto.studentId = student.id;
      createReportDto.grade = this.convertGradeToNumber(gradeLetter);
      createReportDto.rank = 0;
      createReportDto.classId = classId;
      createReportDto.generatedAt = new Date();

      const report = this.reportRepository.create(createReportDto);
      const saved = await this.reportRepository.save(report);
      
      generatedReports.push({
        studentId: student.id,
        status: 'generated',
        reportId: saved.id,
        average: createReportDto.average,
        grade: gradeLetter
      });
    }

    await this.updateClassRanks(classId, termNumber);

    const allReports = await this.reportRepository.find({
      where: { classId: classId, term: termNumber },
      order: { rank: 'ASC' }
    });

    return {
      message: `Generated reports for class ${classId}`,
      classId: classId,
      term: term,
      totalStudents: students.length,
      reportsGenerated: generatedReports.filter(r => r.status === 'generated').length,
      reports: allReports
    };
  }

  private async updateClassRanks(classId: number, term: number) {
    const reports = await this.reportRepository.find({
      where: { classId: classId, term: term },
      order: { average: 'DESC' }
    });

    for (let i = 0; i < reports.length; i++) {
      reports[i].rank = i + 1;
      await this.reportRepository.save(reports[i]);
    }
  }

  private getGradeLetter(average: number): string {
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 75) return 'B+';
    if (average >= 70) return 'B';
    if (average >= 65) return 'C+';
    if (average >= 60) return 'C';
    if (average >= 50) return 'D';
    return 'F';
  }

  private convertGradeToNumber(gradeLetter: string): number {
    const gradeMap: { [key: string]: number } = {
      'A+': 95,
      'A': 90,
      'B+': 85,
      'B': 80,
      'C+': 75,
      'C': 70,
      'D': 60,
      'F': 50
    };
    return gradeMap[gradeLetter] || 70;
  }

  async generateSingleStudentReport(studentId: number, term: string) {
    const termNumber = parseInt(term);
    
    const student = await this.studentRepository.findOne({
      where: { id: studentId }
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const existingReport = await this.reportRepository.findOne({
      where: {
        studentId: studentId,
        term: termNumber
      }
    });

    if (existingReport) {
      throw new ConflictException(
        `Report already exists for student ${studentId} in term "${term}"`
      );
    }

    const grades = await this.gradeRepository.find({
      where: {
        studentId: studentId,
        term: termNumber
      }
    });

    if (grades.length === 0) {
      throw new NotFoundException(`No grades found for student ${studentId} in term ${term}`);
    }

    const total = grades.reduce((sum, grade) => sum + (grade.score || 0), 0);
    const average = total / grades.length;
    const gradeLetter = this.getGradeLetter(average);

    const createReportDto = new CreateReportDto();
    createReportDto.total = total;
    createReportDto.term = termNumber;
    createReportDto.average = parseFloat(average.toFixed(2));
    createReportDto.studentId = studentId;
    createReportDto.grade = this.convertGradeToNumber(gradeLetter);
    createReportDto.rank = 0;
    createReportDto.classId = student.classId;
    createReportDto.generatedAt = new Date();

    const report = this.reportRepository.create(createReportDto);
    const saved = await this.reportRepository.save(report);

    await this.updateClassRanks(student.classId, termNumber);

    return saved;
  }

  async generate(createReportDto: CreateReportDto) {
    const existingReport = await this.reportRepository.findOne({
      where: {
        studentId: createReportDto.studentId,
        term: createReportDto.term
      }
    });
    
    if (existingReport) {
      throw new ConflictException(
        `A report already exists for student ${createReportDto.studentId} in term "${createReportDto.term}"`
      );
    }

    const report = this.reportRepository.create(createReportDto);
    return await this.reportRepository.save(report);
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.findOne(id);
    
    if (updateReportDto.term && updateReportDto.term !== report.term) {
      const conflictReport = await this.reportRepository.findOne({
        where: {
          studentId: updateReportDto.studentId || report.studentId,
          term: updateReportDto.term
        }
      });
      
      if (conflictReport && conflictReport.id !== id) {
        throw new ConflictException(
          `Cannot change term: A report already exists for student ${report.studentId} in term "${updateReportDto.term}"`
        );
      }
    }
    
    Object.assign(report, updateReportDto);
    return await this.reportRepository.save(report);
  }

  async findByStudent(studentId: number) {
    const reports = await this.reportRepository.find({
      where: { studentId },
      order: { generatedAt: 'DESC' }
    });
    
    if (reports.length === 0) {
      throw new NotFoundException(`No reports found for student ID ${studentId}`);
    }
    
    return reports;
  }

  async findByClass(className: string) {
    const classId = parseInt(className);
    
    if (!isNaN(classId)) {
      const reports = await this.reportRepository.find({
        where: { classId },
        order: { rank: 'ASC' }
      });
      
      if (reports.length === 0) {
        throw new NotFoundException(`No reports found for class ID ${classId}`);
      }
      return reports;
    }
    
    const classEntity = await this.classRepository.findOne({
      where: { name: className }
    });

    if (!classEntity) {
      throw new NotFoundException(`Class ${className} not found`);
    }

    const reports = await this.reportRepository.find({
      where: { classId: classEntity.id },
      order: { rank: 'ASC' }
    });
    
    if (reports.length === 0) {
      throw new NotFoundException(`No reports found for class ${className}`);
    }
    
    return reports;
  }

  async getClassOverview(className: string) {
    let reports: Report[] = [];
    const classId = parseInt(className);
    
    if (!isNaN(classId)) {
      reports = await this.reportRepository.find({
        where: { classId },
        order: { rank: 'ASC' }
      });
    } else {
      const classEntity = await this.classRepository.findOne({
        where: { name: className }
      });
      
      if (!classEntity) {
        throw new NotFoundException(`Class ${className} not found`);
      }
      
      reports = await this.reportRepository.find({
        where: { classId: classEntity.id },
        order: { rank: 'ASC' }
      });
    }
    
    if (reports.length === 0) {
      throw new NotFoundException(`No reports found for class ${className}`);
    }
    
    const totalStudents = reports.length;
    const totalAverage = reports.reduce((sum, report) => sum + report.average, 0);
    const totalGrade = reports.reduce((sum, report) => sum + report.grade, 0);
    
    const gradeDistribution = {
      'A+': reports.filter(r => r.grade >= 95).length,
      'A': reports.filter(r => r.grade >= 90 && r.grade < 95).length,
      'B+': reports.filter(r => r.grade >= 85 && r.grade < 90).length,
      'B': reports.filter(r => r.grade >= 80 && r.grade < 85).length,
      'C+': reports.filter(r => r.grade >= 75 && r.grade < 80).length,
      'C': reports.filter(r => r.grade >= 70 && r.grade < 75).length,
      'D': reports.filter(r => r.grade >= 60 && r.grade < 70).length,
      'F': reports.filter(r => r.grade < 60).length,
    };
    
    return {
      className: className,
      term: reports[0]?.term || 'N/A',
      totalStudents: totalStudents,
      averageScore: totalStudents > 0 ? parseFloat((totalAverage / totalStudents).toFixed(2)) : 0,
      averageGrade: totalStudents > 0 ? parseFloat((totalGrade / totalStudents).toFixed(2)) : 0,
      highestScore: reports.length > 0 ? Math.max(...reports.map(r => r.average)) : 0,
      lowestScore: reports.length > 0 ? Math.min(...reports.map(r => r.average)) : 0,
      gradeDistribution: gradeDistribution,
      topPerformers: reports.filter(r => r.rank <= 3).map(r => ({
        rank: r.rank,
        studentId: r.studentId,
        average: r.average
      })),
      totalReports: reports.length,
      reportsGenerated: new Date()
    };
  }

  async findAll() {
    return await this.reportRepository.find();
  }

  async findOne(id: number) {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    return await this.reportRepository.remove(report);
  }
}
      