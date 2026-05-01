import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { GradesModule } from './grades/grades.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GradesModule,
    ReportModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'student-management.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
