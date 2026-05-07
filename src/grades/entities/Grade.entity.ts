import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('grades')
export class Grade {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'number' })
    classId!: number;

    @Column({ type: 'number' })
    studentId!: number;

    @Column({ type: 'number' })
    subjectId!: number;

    @Column({ name: 'term', type: 'number' })
    term!: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    score!: number;

    @CreateDateColumn()
    createAt!: Date;

    @UpdateDateColumn()
    updateAt!: Date;
}