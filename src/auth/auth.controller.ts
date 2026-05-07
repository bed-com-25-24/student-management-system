import {
    Controller,
    Post,
    Put,
    Body,
    UnauthorizedException,
    NotFoundException,
    Get,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthLoginDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user account' })
    async register(@Body() body: { firstName: string; LastName: string; email: string; password: string; role?: string }) {
        return this.authService.register(body);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with username and password, returns JWT token' })
    @ApiResponse({ status: 201, description: 'Returns access_token.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() body: AuthLoginDto) {
        const identifier = body.email || '';
        const result = await this.authService.validateUser(identifier, body.password);
        if (result?.error === 'USER_NOT_FOUND') {
            throw new UnauthorizedException('No account found with that username or email');
        }
        if (result?.error === 'NO_PASSWORD') {
            throw new UnauthorizedException('This account has no password set. Please use the reset endpoint to set one.');
        }
        if (result?.error === 'WRONG_PASSWORD') {
            throw new UnauthorizedException('Incorrect password');
        }
        return this.authService.login(result);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout (client should discard the JWT token)' })
    async logout() {
        // JWT is stateless — client discards the token
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    @ApiOperation({ summary: 'Get the profile of the currently authenticated user' })
    async getProfile(@CurrentUser() user: { id: number; email: string; role: string }) {
        const profile = await this.authService.getMe(user.id);
        if (!profile) {
            throw new NotFoundException('User not found');
        }
        return profile;
    }

    @Put('reset')
    @ApiOperation({ summary: 'Request OTP to reset password (sent via email)' })
    @ApiBody({ schema: { example: { email: 'user@example.com' } } })
    async requestOtp(@Body('email') email: string) {
        return this.authService.requestOtp(email);
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verify the OTP sent to email' })
    @ApiBody({ schema: { example: { email: 'user@example.com', otp: '123456' } } })
    async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
        const isValid = await this.authService.verifyOtp(email, otp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }
        return { message: 'OTP verified successfully' };
    }

    @Put('password')
    @ApiOperation({ summary: 'Set a new password after OTP verification' })
    @ApiBody({ schema: { example: { email: 'user@example.com', otp: '123456', newPassword: 'NewPass123!', confirmPassword: 'NewPass123!' } } })
    async resetPassword(
        @Body('email') email: string,
        @Body('otp') otp: string,
        @Body('newPassword') newPassword: string,
        @Body('confirmPassword') confirmPassword: string,
    ) {
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }
        return this.authService.resetPassword(email, otp, newPassword);
    }
}
