// report.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Class } from 'src/students/entities/class.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  // POST /reports/generate
  async generate(createReportDto: CreateReportDto) {
    const report = this.reportRepository.create(createReportDto);
    return await this.reportRepository.save(report);
  }

  // GET /reports/student/:id
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

  // GET /reports/class/:class
  async findByClass(className: string) {
    // If className is a number (classId), use it directly
    const classId = parseInt(className);
    if (!isNaN(classId)) {
      const reports = await this.reportRepository.find({
        where: { classId },
        order: { generatedAt: 'DESC' }
      });
      
      if (reports.length === 0) {
        throw new NotFoundException(`No reports found for class ID ${classId}`);
      }
      return reports;
    }
    
    // If className is a string, try to find by class name in student table
    // This assumes student table has a 'className' field
    const reports = await this.reportRepository
      .createQueryBuilder('report')
      .leftJoin('report.student', 'student')
      .addSelect('student.className')
      .where('student.className = :className', { className })
      .getMany();
    
    if (reports.length === 0) {
      throw new NotFoundException(`No reports found for class ${className}`);
    }
    
    return reports;
  }

  // GET /reports/class/:class/overview
  async getClassOverview(className: string) {
    let reports: Report[] = [];
    const classId = parseInt(className);
    
    // Get reports by classId or className
    if (!isNaN(classId)) {
      reports = await this.reportRepository.find({
        where: { classId }
      });
    } else {
      reports = await this.reportRepository
        .createQueryBuilder('report')
        .leftJoin('report.student', 'student')
        .addSelect('student.className')
        .where('student.className = :className', { className })
        .getMany();
    }
    
    if (reports.length === 0) {
      throw new NotFoundException(`No reports found for class ${className}`);
    }
    
    // Calculate statistics
    const totalStudents = reports.length;
    const totalAverage = reports.reduce((sum, report) => sum + Number(report.average), 0);
    const totalGrade = reports.reduce((sum, report) => sum + Number(report.grade), 0);
    
    return {
      className: className,
      totalStudents: totalStudents,
      averageScore: totalStudents > 0 ? parseFloat((totalAverage / totalStudents).toFixed(2)) : 0,
      averageGrade: totalStudents > 0 ? parseFloat((totalGrade / totalStudents).toFixed(2)) : 0,
      highestScore: reports.length > 0 ? Math.max(...reports.map(r => r.average)) : 0,
      lowestScore: reports.length > 0 ? Math.min(...reports.map(r => r.average)) : 0,
      totalReports: reports.length,
      reportsGenerated: new Date()
    };
  }

  // Additional CRUD methods (optional)
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

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.findOne(id);
    Object.assign(report, updateReportDto);
    return await this.reportRepository.save(report);
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    return await this.reportRepository.remove(report);
  }
}