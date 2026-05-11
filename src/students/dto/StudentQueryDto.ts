import { IsOptional, IsString } from 'class-validator';

export class StudentQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  order?: 'ASC' | 'DESC';
}