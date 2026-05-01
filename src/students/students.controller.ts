import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { StudentService } from './students.service';

@Controller('api/v1/students')
export class StudentsController {
  constructor(private studentService: StudentService) {}

  @Post()
  create(@Body() dto: any) {
    return this.studentService.createStudent(dto);
  }

  @Get()
  findAll() {
    return this.studentService.findAllStudents();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentService.findStudentById(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: any) {
    return this.studentService.updateStudent(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.studentService.deleteStudent(+id);
  }
}