// dto/create-report.dto.ts
import { IsNumber, IsString,  IsNotEmpty, IsOptional, IsDate, Min, Max  } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total!: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  term!: number;

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
  @ApiProperty({ required: false })
  classId?: number;
}