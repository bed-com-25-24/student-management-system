import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GenerateBatchReportDto } from './dto/generate-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) { }

  // Endpoint 1: POST /api/v1/reports/generate
  async generateReport(generateBatchDto: GenerateBatchReportDto) {
    // Mock generating end-of-term reports for all students in the class
    const dummyReports = [1, 2, 3].map((studentId) => {
      return this.reportRepository.create({
        total: Math.floor(Math.random() * 100),
        term: generateBatchDto.term,
        classId: generateBatchDto.class,
        average: Math.floor(Math.random() * 100),
        studentId: studentId,
        grade: Math.floor(Math.random() * 100),
        rank: studentId,
        generatedAt: new Date(),
      } as any);
    });

    return this.reportRepository.save(dummyReports as any);
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

  // Endpoint 2: GET /api/v1/reports/student/:id
  async getStudentReport(studentId: number, term?: string) {
    const whereCondition = term ? { studentId, term } : { studentId };
    const reports = await this.reportRepository.find({ where: whereCondition });

    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No reports found for student with id ${studentId}`);
    }

    return reports;
  }

  // Endpoint 3: GET /api/v1/reports/class/:class
  async getClassReport(classId: number, term?: string) {
    const whereCondition = term ? { classId, term } : { classId };
    const reports = await this.reportRepository.find({ where: whereCondition });

    if (!reports || reports.length === 0) {
      throw new NotFoundException(`No reports found for class id ${classId}`);
    }

    return reports;
  }

  // Endpoint 4: GET /api/v1/reports/class/:class/overview
  async getClassOverview(classId: number, term?: string) {
    const whereCondition = term ? { classId, term } : { classId };
    const reports = await this.reportRepository.find({ where: whereCondition });

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
