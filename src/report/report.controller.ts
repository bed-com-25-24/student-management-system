import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { ReportService  } from './report.service';
import {CreateReportDto} from './dto/create-report.dto';

@Controller('reports')
export class ReportController{
    constructor (private readonly reportService : ReportService){}
}

    @Post ('creat')
    async createReport(@Body() dto: CreateReportDto){
    return this.reportService.createReports(dto.classId,dto.term);
}

@Get('student/: name')
async getStudent(@Param('name') name: string) {
    return this.reportService.getStudentReport(name);
  }



