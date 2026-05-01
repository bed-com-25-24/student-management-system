import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    LastName?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    subject?: string;

    @IsNumber()
    @IsOptional()
    class?: number;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsOptional()
    role?: string;
}
