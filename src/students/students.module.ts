import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Class])],
  controllers: [StudentsController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentsModule { }