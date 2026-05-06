import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { GradesModule } from './grades/grades.module';
import { ReportModule } from './report/report.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Grade } from './grades/entities/Grade.entity';
import { Report } from './report/entities/report.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'oracle',
                host: config.get('DB_HOST'),
                port: parseInt(config.get<string>('DB_PORT') || '1521', 10),
                username: config.get('DB_USERNAME'),
                password: config.get('DB_PASSWORD'),
                serviceName: config.get('DB_SERVICE_NAME'),
                synchronize: config.get('DB_SYNCHRONIZE') === 'true',
                entities: [User, Grade, Report],
                logging: true,
            }),
        }),
        StudentsModule,
        GradesModule,
        ReportModule,
        UsersModule,
        AuthModule,
    ],
})
export class AppModule { }
