import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
        const user = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
        return await this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error('User not found');
        }
        const dataToUpdate: Partial<UpdateUserDto> = { ...updateUserDto };
        if (dataToUpdate.password) {
            const saltOrRounds = 10;
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, saltOrRounds);
        }
        await this.usersRepository.update(id, dataToUpdate);
        return this.usersRepository.findOne({ where: { id } }) as Promise<User>;
    }

    async setOtp(userId: number, otp: string, expiresInMinutes = 15): Promise<void> {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
        await this.usersRepository.update(userId, { otp, otpExpiresAt: expiresAt });
    }

    async verifyOtp(email: string, otp: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { email, otp } });
        if (!user || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
            return null;
        }
        return user;
    }

    async updatePassword(userId: number, newPasswordPlain: string): Promise<void> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(newPasswordPlain, saltOrRounds);
        await this.usersRepository.update(userId, {
            password: hashedPassword,
            otp: undefined,
            otpExpiresAt: undefined,
        });
    }

    async remove(id: number): Promise<{ message: string }> {
        await this.usersRepository.delete(id);
        return { message: `User ${id} deleted successfully` };
    }
}
