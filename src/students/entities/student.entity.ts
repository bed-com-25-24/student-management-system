import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  dateOfBirth!: Date;

  @Column()
  classId!: number;// changed from class to this 

  @ManyToOne(() => User)
  createdBy!: User;
}