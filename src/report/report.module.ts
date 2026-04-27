import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './entities/report.entity';
import { Student } from './entities/student.entity';
import { Grade } from './entities/grade.entity';

@Module({
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
