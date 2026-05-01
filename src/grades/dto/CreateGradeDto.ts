import{IsString,IsNumber,IsNotEmpty,IsDefined} from 'class-validator';
export class CreateGradeDto{
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    studentId!:number;
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    classId!:number;
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    subjectId! :number;
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    term! :string;
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    score! :number; 
};
