import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGradeByStudentSubjectDto {
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  classId!: number;

  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  score!: number;
}
