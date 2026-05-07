import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Jane Smith' })
  fullName!: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2000-01-15', description: 'ISO date string' })
  dateOfBirth?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 1, description: 'ID of the class to assign the student to' })
  classId?: number;
}