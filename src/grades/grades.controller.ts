import { BadRequestException, Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/CreateGradeDto';
import { UpdateGradeDto } from './dto/UpdateGradeDto';
import { PickType } from '@nestjs/mapped-types';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

class CreateGradeByStudentSubjectDto extends PickType(CreateGradeDto, ['classId', 'score'] as const) { }

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) { }

  // Teacher enters score per student per subject per term
  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  // Averages per subject in a class/term
  @Get('averages')
  computeAverages(
    @Query('class') classId: string,
    @Query('term') term: string,
  ) {
    return this.gradesService.computeSubjectAverages(parseInt(classId, 10), term);
  }

  // Class ranking and grade boundary mapping
  @Get('ranking')
  computeRanking(@Query('class') classId: string, @Query('term') term: string) {
    return this.gradesService.computeClassRanking(parseInt(classId, 10), term);
  }

  // Final grade calculation per student per term
  @Get('final/:studentId/:term')
  computeFinal(
    @Param('studentId') studentId: string,
    @Param('term') term: string,
  ) {
    return this.gradesService.computeFinalGrade(+studentId, term);
  }

  // Get grade of a specific student in a subject
  @Get('student/:studentId/subject/:subjectId')
  findByStudentAndSubject(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string,
    @Query('term') term?: string,
  ) {
    return this.gradesService.findByStudentAndSubject(+studentId, +subjectId, term);
  }

  // Create a grade record for a specific student and subject
  @Post('student/:studentId/subject/:subjectId')
  createByStudentAndSubject(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string,
    @Query('term') term: string,
    @Body() createGradeDto: CreateGradeByStudentSubjectDto,
  ) {
    if (!term) {
      throw new BadRequestException('The term query parameter is required');
    }

    return this.gradesService.create({
      ...createGradeDto,
      studentId: +studentId,
      subjectId: +subjectId,
      term,
    } as CreateGradeDto);
  }

  // Update grade of a specific student in a subject
  @Patch('student/:studentId/subject/:subjectId')
  updateByStudentAndSubject(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @Query('term') term?: string,
  ) {
    return this.gradesService.updateByStudentAndSubject(+studentId, +subjectId, updateGradeDto, term);
  }

  // Overview endpoint: display entered grades for cross-check
  @Get()
  findAll(@Query('class') classId?: string, @Query('term') term?: string) {
    return this.gradesService.findAll(classId ? parseInt(classId, 10) : undefined, term);
  }

  // Get single grade entry
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(+id);
  }

  // Allow correction; log audit trail
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(+id, updateGradeDto);
  }
}

