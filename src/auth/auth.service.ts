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
        private jwtService: JwtService,
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER || '',
                pass: process.env.MAIL_PASS || '',
            },
        });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { error: 'USER_NOT_FOUND' };
        }
        if (!user.password) {
            return { error: 'NO_PASSWORD' };
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            return { error: 'WRONG_PASSWORD' };
        }
        const { password, ...result } = user;
        return result;
    }

    async register(dto: { firstName: string; LastName: string; email: string; password: string; role?: string }) {
        return this.usersService.create(dto as any);
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getMe(id: number) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            return null;
        }
        // Strip sensitive fields before returning
        const { password, otp, otpExpiresAt, ...profile } = user;
        return profile;
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
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">Password Reset</h1>
                        </div>
                        <div style="padding: 20px; color: #333; line-height: 1.6;">
                            <p>Hello,</p>
                            <p>We received a request to reset your password. Here is your One-Time Password (OTP):</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="font-size: 32px; font-weight: bold; background-color: #f4f4f4; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px; color: #333;">${otp}</span>
                            </div>
                            <p>This OTP is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
                            <p>Best regards,<br>Student Management Team</p>
                        </div>
                        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777;">
                            &copy; ${new Date().getFullYear()} Student Management System. All rights reserved.
                        </div>
                    </div>
                `,
            });
        } catch (err) {
            console.error('Error sending email:', err);
        }

        return { message: 'If email exists, an OTP will be sent' };
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const user = await this.usersService.verifyOtp(email, otp);
        return !!user;
    }

    async resetPassword(email: string, otp: string, newPasswordPlain: string) {
        const user = await this.usersService.verifyOtp(email, otp);
        if (!user) throw new UnauthorizedException('Invalid or expired OTP');
        await this.usersService.updatePassword(user.id as number, newPasswordPlain);
        return { message: 'Password has been reset successfully' };
    }
}
