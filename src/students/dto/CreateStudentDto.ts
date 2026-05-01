import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  fullName!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsNumber()
  classId!: number;
}