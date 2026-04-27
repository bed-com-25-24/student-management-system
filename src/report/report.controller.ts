import { Body, Controller, Get, Param } from '@nestjs/common';
import { generate } from 'rxjs';

@Post ('generate')
generate(@Body() dto : GenerateReportDto){
    return this.reportService.generateReports(dto.classId,dto.term);
}

@Get('student/: name')
getStudent(@Param('name') name :string){
    return this.reportService.getstudentReport(name);

}


