// entities/report.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';


@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  total!: number;

  @Column({ type: 'varchar', length: 50 })
  term!: string;

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