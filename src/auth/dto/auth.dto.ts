import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
export class AuthLoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email!: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
};
