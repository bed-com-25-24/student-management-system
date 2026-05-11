import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { StudentService } from './students.service';
import { CreateStudentDto } from './dto/CreateStudentDto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private studentService: StudentService) { }

  @Post()
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully.' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.createStudent(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all students (filter by class)' })
  @ApiQuery({ name: 'classId', required: false, description: 'Filter by class ID' })
  findAll(@Query('classId') classId?: string) {
    return this.studentService.findAllStudents({ classId: classId ? Number(classId) : undefined });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.findStudentById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student record' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateStudentDto>) {
    return this.studentService.updateStudent(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.deleteStudent(id);
  }

  @Get(':id/grades')
  @ApiOperation({ summary: 'Get all grades for a specific student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  getStudentGrades(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.getStudentGrades(id);
  }
}