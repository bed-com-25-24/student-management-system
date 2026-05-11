import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    LastName?: string;

    @Column({ unique: true, nullable: true })
    email?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ default: 'user', nullable: true })
    role?: string;

    @Column({ nullable: true })
    otp?: string;

    @Column({ type: 'timestamp', nullable: true })
    otpExpiresAt?: Date;
}
