// entities/report.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  total!: number;

  @Column()
  term!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  average!: number;

  @Column()
  studentId!: number;

  @Column({ type: 'int', nullable: true })
  classId?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  grade!: number;

  @Column()
  rank!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt!: Date;


}