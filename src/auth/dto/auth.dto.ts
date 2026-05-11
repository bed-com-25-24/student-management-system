import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Email address used as username', example: 'john@school.edu' })
    email!: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'password123' })
    password!: string;
}
