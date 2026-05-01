import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  // Endpoint 1: POST /reports/generate
  async generateReport(createReportDto: CreateReportDto) {
    // Create a new report from the DTO
    const report = this.reportRepository.create({
      total: createReportDto.total,
      term: createReportDto.term,
      average: createReportDto.average,
      studentId: createReportDto.studentId,
      grade: createReportDto.grade,
      rank: createReportDto.rank,
      generatedAt: createReportDto.generatedAt || new Date(),
    });
    
    return this.reportRepository.save(report);
  }

  // Original create method (can be kept or removed)
  async create(createReportDto: CreateReportDto) {
    const report = this.reportRepository.create(createReportDto);
    return this.reportRepository.save(report);
  }

  async findAll() {
    return this.reportRepository.find();
  }

  async findOne(id: number) {
    const report = await this.reportRepository.findOne({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.preload({
      id,
      ...updateReportDto,
    });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return this.reportRepository.save(report);
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    return this.reportRepository.remove(report);
  }

  // Endpoint 2: GET /reports/student/:id
  async getStudentReport(studentId: number) {
    const reports = await this.reportRepository.find({ where: { studentId } });
    
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No reports found for student with id ${studentId}`);
    }
    
    return reports;
  }

  // Endpoint 3: GET /reports/class/:classId
  async getClassReport(classId: number) {
    const reports = await this.reportRepository.find({ where: { classId } });
    
    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No reports found for class id ${classId}`);
    }
    
    return reports;
  }

  // Endpoint 4: GET /reports/class/:classId/overview
  async getClassOverview(classId: number) {
    const reports = await this.reportRepository.find({ where: { classId } });

    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No reports found for class id ${classId}`);
    }

    // Calculate statistics
    const totalReports = reports.length;
    const averageScore = reports.reduce((sum, report) => sum + (report.average || 0), 0) / totalReports;
    const averageGrade = reports.reduce((sum, report) => sum + (report.grade || 0), 0) / totalReports;

    return {
      classId,
      totalReports,
      averageScore,
      averageGrade,
      term: reports[0]?.term || 'N/A',
      generatedAt: new Date(),
    };
  }
}
