// entities/student.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Grade } from './grade.entity';
import { Report } from './report.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  classId: number;

  @OneToMany(() => Grade, grade => grade.student)
  grades: Grade[];

  @OneToMany(() => Report, report => report.student)
  reports: Report[];
}