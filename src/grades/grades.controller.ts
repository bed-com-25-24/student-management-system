import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Put,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/CreateGradeDto';
import { UpdateGradeDto } from './dto/UpdateGradeDto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@ApiTags('Grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) { }

  // POST /api/v1/grades — Enter grades for a student per subject
  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  // GET /api/v1/grades?class=&term= — Display entered grades for cross-check
  @Get()
  findAll(@Query('class') classId?: string, @Query('term') term?: string) {
    return this.gradesService.findAll(classId ? parseInt(classId, 10) : undefined, term);
  }

  // GET /api/v1/grades/class/:classId/overview — Class performance overview
  @Get('class/:classId/overview')
  getClassOverview(
    @Param('classId') classId: string,
    @Query('term') term?: string,
  ) {
    return this.gradesService.computeClassRanking(parseInt(classId, 10), term || '');
  }



  // PUT /api/v1/grades/:id — Update or correct a grade entry
  @Put(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(+id, updateGradeDto);
  }

  // DELETE /api/v1/grades/:id — Delete a grade entry
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradesService.remove(+id);
  }
}


