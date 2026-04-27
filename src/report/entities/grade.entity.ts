// entities/grade.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from './student.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  term: string;

  @ManyToOne(() => Student, student => student.grades)
  student: Student;
}