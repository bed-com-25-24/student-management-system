import { Column, Entity, PrimaryGeneratedColumn, ManyToOne,JoinColumn } from "typeorm";

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn()
    id !: number;

    @Column()
    studentId! :number;

    @Column()
    term !: string;

    @Column('float')
    total!: number;

    @Column('float')
    average! : number;

    @Column({nullable : true })
    grade !:number ;

    @Column({nullable : true})
    rank !: number ;
}