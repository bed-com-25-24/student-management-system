// dto/create-report.dto.ts
import { IsNumber, IsString,  IsNotEmpty, IsOptional, IsDate, Min, Max  } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total!: number;

  @IsString()
  @IsNotEmpty()
  term!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  average!: number;

  @IsNumber()
  @IsNotEmpty()
  studentId!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  grade!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  rank!: number;

  @IsOptional()
   @Type(() => Date)
  @IsDate()
  generatedAt?: Date;

  @IsOptional()
  @IsNumber()
  classId?: number;
}