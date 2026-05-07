import{Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn} from "typeorm";
@Entity('grades')
export class Grade{
    @PrimaryGeneratedColumn()
    id!:number;
    @Column()
    classId! :number;
    @Column()
    studentId! :number;
    @Column()
    subjectId! :number;
    @Column({ type: 'number',length :20})
    term!:Number;
    @Column({ type: 'decimal', precision: 5, scale: 2 })
    score! :number;
    @CreateDateColumn()
    createAt!:Date;
    @UpdateDateColumn()
    updateAt! :Date;


}