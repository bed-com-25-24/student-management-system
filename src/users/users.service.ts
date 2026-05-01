import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
     private usersRepository: Repository<User>, 
  ){}

 async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto)
    return await this.usersRepository.save(user);
  }

  async findAll():Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } })
    return user;
    
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>{
    const user = await this.findOne(id); 
    if (!user) {
      throw new Error('User not found');
    }
    await this.usersRepository.update(id, updateUserDto);
    return user;
  }

  async findAllSubject(): Promise<{message: string }>{
    return { message: 'To find all subjects assigned to a teacher'};
  }

  async findClass(): Promise<{message: string}>{
    return {message: 'To find a class assigned to a teacher'}
  }

  async remove(id: number): Promise<{ message: string }> { 
    await this.findOne(id); 
    await this.usersRepository.delete(id); 
    return { message: `users ${id} deleted successfully` }; 
  } 
}
