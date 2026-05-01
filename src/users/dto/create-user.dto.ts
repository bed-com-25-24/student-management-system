import { IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateUserDto {
    @IsNumber()
    @IsNotEmpty()
    id! :number ;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    LastName? : string;

    @IsString()
    @IsOptional()
    email? :string;

    @IsString()
    @IsOptional()
    subject? : string;

    @IsNumber()
    @IsOptional()
    class? : number


}
