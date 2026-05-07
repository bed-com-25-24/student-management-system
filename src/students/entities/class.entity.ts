import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('class')
export class Class {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;
}