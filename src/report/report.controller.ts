import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('generate')
  async createReport(@Body() dto: CreateReportDto) {
    return this.reportService.createReports(dto.classId, dto.term);
  }

  @Get('student/:id')
  async getStudent(@Param('id') student: number): Promise<any> {
    return this.reportService.getStudentReport(student);
  }

  @Get('class/:class')
  async getClass(@Param('class') className: string) {
    return this.reportService.getClassReport(className);
  }

  @Get('class/:class/overview')
  async getClassOverview(@Param('class') className: string) {
    return this.reportService.getClassOverview(className);
  }
}
