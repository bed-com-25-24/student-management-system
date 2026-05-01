import { PartialType } from '@nestjs/mapped-types'; 
import { CreateReportDto } from './create-report.dto';
import { IsNumber } from 'class-validator';

export class UpdateReportDto extends PartialType(CreateReportDto) {}
