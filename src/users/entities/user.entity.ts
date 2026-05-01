import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    firstName?: string

    @Column()
    LastName?: string

    @Column()
    email?: string

    @Column({ nullable: true })
    password?: string;

    @Column({ default: 'user' })
    role?: string;

    @Column({ nullable: true })
    otp?: string;

    @Column({ type: 'timestamp', nullable: true })
    otpExpiresAt?: Date;
}
