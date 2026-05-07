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
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { firstName: string; LastName: string; email: string; password: string; role?: string }) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: { email?: string; password: string }) {
        const identifier = body.email || '';
        const result = await this.authService.validateUser(identifier, body.password);
        if (result?.error === 'USER_NOT_FOUND') {
            throw new UnauthorizedException('No account found with that email address');
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
    async logout() {
        // JWT is stateless — client discards the token
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@CurrentUser() user: { id: number; email: string; role: string }) {
        const profile = await this.authService.getMe(user.id);
        if (!profile) {
            throw new NotFoundException('User not found');
        }
        return profile;
    }

    @Put('reset')
    async requestOtp(@Body('email') email: string) {
        return this.authService.requestOtp(email);
    }

    @Post('verify')
    async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
        const isValid = await this.authService.verifyOtp(email, otp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }
        return { message: 'OTP verified successfully' };
    }

    @Put('password')
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
