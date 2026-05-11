import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column()
  @ApiProperty({ example: 'Maxwell Simbeye' })
  fullName!: string;

  @Column({ nullable: true, type: 'date' })
  @ApiPropertyOptional({ example: '2000-01-15' })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  @ApiPropertyOptional({ example: 1 })
  classId?: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({ description: 'ID of the user (teacher) who created this record' })
  createdById?: number;
}