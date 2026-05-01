import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Class } from './class.entity';
import { User } from './user.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  dateOfBirth!: Date;

  @ManyToOne(() => Class)
  class!: Class;

  @ManyToOne(() => User)
  createdBy!: User;
}