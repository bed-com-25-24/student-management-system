import { Param } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    term : string;

    @Column()
    total : number;

    @Column
    average : number;

    @Column({nullable : true })
    grade :string ;

    @Column({nullable : true})
    rank : number ;sw3  
}