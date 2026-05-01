import { IsOptional } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  fullName?: string;

  @IsOptional()
  dateOfBirth?: string;
}