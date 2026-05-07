// report.controller.ts
import {  Controller,  Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // POST /reports/generate
  @Post('generate')
  generate(@Body() createReportDto: CreateReportDto) {
    return this.reportService.generate(createReportDto);
  }

  // GET /reports/student/:id
  @Get('student/:id')
  getStudentReports(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.findByStudent(id);
  }

  // GET /reports/class/:class
  @Get('class/:class')
  getClassReports(@Param('class') className: string) {
    return this.reportService.findByClass(className);
  }

  // GET /reports/class/:class/overview
  @Get('class/:class/overview')
  getClassOverview(@Param('class') className: string) {
    return this.reportService.getClassOverview(className);
  }

  // Additional CRUD endpoints (optional)
  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.remove(id);
  }
}

