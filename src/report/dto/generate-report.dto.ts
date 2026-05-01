// dto/generate-report.dto.ts
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class GenerateBatchReportDto {
    @IsNumber()
    @IsNotEmpty()
    classId!: number;

    @IsString()
    @IsNotEmpty()
    term!: string;
}
