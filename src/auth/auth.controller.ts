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

    @Post('login')
    async login(@Body() body: { email?: string; password: string }) {
        const identifier = body.email || '';
        const user = await this.authService.validateUser(identifier, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
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
