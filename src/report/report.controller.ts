import { Body, Controller, Get, Param, Post, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { GenerateBatchReportDto } from './dto/generate-report.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  // Endpoint 1: POST /api/v1/reports/generate
  @Post('generate')
  async generateReport(@Body() generateBatchDto: GenerateBatchReportDto) {
    return this.reportService.generateReport(generateBatchDto);
  }

  // Endpoint 2: GET /api/v1/reports/student/:id
  @Get('student/:id')
  async getStudentReport(
    @Param('id', ParseIntPipe) studentId: number,
    @Query('term') term: string
  ) {
    return this.reportService.getStudentReport(studentId, term);
  }

  // Endpoint 3: GET /api/v1/reports/class/:class
  @Get('class/:class')
  async getClassReport(
    @Param('class', ParseIntPipe) classId: number,
    @Query('term') term: string
  ) {
    return this.reportService.getClassReport(classId, term);
  }

  // Endpoint 4: GET /api/v1/reports/class/:class/overview
  @Get('class/:class/overview')
  async getClassOverview(
    @Param('class', ParseIntPipe) classId: number,
    @Query('term') term: string
  ) {
    return this.reportService.getClassOverview(classId, term);
  }
}
