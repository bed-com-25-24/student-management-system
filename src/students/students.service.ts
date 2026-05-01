import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async createStudent(dto: any) {
    const student = this.studentRepo.create(dto);
    return await this.studentRepo.save(student);
  }

  async findAllStudents() {
    return this.studentRepo.find({ relations: ['class'] });
  }

  async findStudentById(id: number) {
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async updateStudent(id: number, dto: any) {
    await this.studentRepo.update(id, dto);
    return this.findStudentById(id);
  }

  async deleteStudent(id: number) {
    await this.studentRepo.delete(id);
    return { message: 'Student deleted' };
  }
}