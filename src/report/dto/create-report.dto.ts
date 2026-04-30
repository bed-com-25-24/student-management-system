// dto/create-report.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  classId(classId: any, term: string) {
    throw new Error('Method not implemented.');
  }
  @IsNumber()
  id!: number;

  @IsNumber()
  total!: number;

  @IsString()
  term!: string;

  @IsNumber()
  average!:number;

  @IsNumber()
  studentId!: number;

  @IsNumber()
  grade!: number;

  @IsNumber()
  rank!: number;
  
}