import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './entities/report.entity';
import { Student } from 'src/students/entities/student.entity';
import { Grade } from 'src/grades/entities/Grade.entity';
import { Class } from 'src/students/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Student, Grade, Class])],
  providers: [ReportService],
  controllers: [ReportController],

  exports:[ReportService]

})
export class ReportModule {}
