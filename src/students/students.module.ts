import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';
import { ClassService } from './classes.service';
import { ClassesController } from './classes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Class])],
  controllers: [StudentsController, ClassesController],
  providers: [StudentService, ClassService],
  exports: [StudentService, ClassService],
})
export class StudentsModule { }