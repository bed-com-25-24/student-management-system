import { Param } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne,JoinColumn } from "typeorm";
import { Student } from "./student.entity";
import {Grade } from "./grade.entity";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => Student)
    @JoinColumn({name : 'studentId'})
    student : Student;

    @Column()
    term : string;

    @Column('float')
    total : number;

    @Column('float')
    average : number;

    @Column({nullable : true })
    grade :string ;

    @Column({nullable : true})
    rank : number ;
}