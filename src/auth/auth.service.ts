import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
    private transporter: nodemailer.Transporter;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
            port: Number(process.env.MAIL_PORT) || 2525,
            auth: {
                user: process.env.MAIL_USER || 'dummy',
                pass: process.env.MAIL_PASS || 'dummy',
            },
        });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password) {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async requestOtp(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'If email exists, an OTP will be sent' };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.usersService.setOtp(user.id as number, otp);

        try {
            await this.transporter.sendMail({
                from: '"Student Management" <noreply@student.management.com>',
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
            });
        } catch (err) {
            console.log('Error sending email:', err);
        }

        return { message: 'If email exists, an OTP will be sent' };
    }

    async verifyOtp(email: string, otp: string) {
        const user = await this.usersService.verifyOtp(email, otp);
        if (!user) return false;
        return true;
    }

    async resetPassword(email: string, otp: string, newPasswordPlain: string) {
        const user = await this.usersService.verifyOtp(email, otp);
        if (!user) throw new UnauthorizedException('Invalid or expired OTP');
        await this.usersService.updatePassword(user.id as number, newPasswordPlain);
        return { message: 'Password has been reset successfully' };
    }
}
