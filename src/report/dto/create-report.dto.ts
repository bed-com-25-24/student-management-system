// dto/create-report.dto.ts
import { IsNumber, IsString,  IsNotEmpty, IsOptional, IsDate, Min, Max  } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  total!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  term!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @ApiProperty()
  average!: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  studentId!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @ApiProperty()
  grade!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  rank!: number;

  @IsOptional()
   @Type(() => Date)
  @IsDate()
 @ApiProperty({ required: false }) 
  generatedAt?: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  classId?: number;
}