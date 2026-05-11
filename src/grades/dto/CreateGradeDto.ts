import { ApiProperty } from '@nestjs/swagger';
import{IsString,IsNumber,IsNotEmpty,IsDefined} from 'class-validator';
export class CreateGradeDto{
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    studentId!:number;
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    classId!:number;
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    subjectId! :number;
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    term! :number;
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    score! :number; 
};
