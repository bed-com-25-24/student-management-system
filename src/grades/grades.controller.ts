import { Controller,Get,Post,Patch,Param,Body,Query } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/CreateGradeDto';
import { UpdateGradeDto } from './dto/UpdateGradeDto';

@Controller('grades')
export class GradesController {
     constructor(private readonly gradesService:GradesService){}
    // Teacher enters score per student per subject per term
  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
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
    // Get grade of a specific student in a subject
@Get('student/:studentId/subject/:subjectId')
findByStudentAndSubject(
  @Param('studentId') studentId: string,
  @Param('subjectId') subjectId: string,
  @Query('term') term?: string,
) {
  return this.gradesService.findByStudentAndSubject(+studentId, +subjectId, term);
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

   // Final grade calculation per student per term
  @Get('final/:studentId/:term')
  computeFinal(
    @Param('studentId') studentId: string,
    @Param('term') term: string,
  ) {
    return this.gradesService.computeFinalGrade(+studentId, term);
  }

  // Class ranking and grade boundary mapping
  @Get('ranking')
  computeRanking(@Query('class') classId: string, @Query('term') term: string) {
    return this.gradesService.computeClassRanking(parseInt(classId, 10), term);
  }
}

