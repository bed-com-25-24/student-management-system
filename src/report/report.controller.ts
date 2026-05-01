import { Body, Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // Endpoint 1: POST /reports/generate
  @Post('generate')
  async generateReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.generateReport(createReportDto);
  }

  // Endpoint 2: GET /reports/student/:id
  @Get('student/:id')
  async getStudentReport(@Param('id', ParseIntPipe) studentId: number) {
    return this.reportService.getStudentReport(studentId);
  }

  // Endpoint 3: GET /reports/class/:classId
  @Get('class/:classId')
  async getClassReport(@Param('classId', ParseIntPipe) classId: number) {
    return this.reportService.getClassReport(classId);
  }

  // Endpoint 4: GET /reports/class/:classId/overview
  @Get('class/:classId/overview')
  async getClassOverview(@Param('classId', ParseIntPipe) classId: number) {
    return this.reportService.getClassOverview(classId);
  }
}
