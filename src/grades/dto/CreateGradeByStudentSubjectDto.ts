import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGradeByStudentSubjectDto {
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  classId!: number;

  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  score!: number;
}
