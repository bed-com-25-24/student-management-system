// entities/report.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Grade } from 'src/grades/entities/Grade.entity';


@Entity('reports')
@Unique(['studentId', 'term'])
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  total!: number;

  @Column()
  term!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  average!: number;

  @Column({ type: 'int' })
  studentId!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  grade!: number;

  @Column({ type: 'int' })
  rank!: number;

  @Column({ type: 'int', nullable: true })
  classId!: number;

  @CreateDateColumn()
  generatedAt!: Date;
}