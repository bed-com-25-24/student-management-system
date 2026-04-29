import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GradesModule } from './grades/grades.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Grade } from './grades/entities/Grade.entity';

@Module({
  imports:[
  ConfigModule.forRoot({isGlobal:true, envFilePath: '.env'}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>(
        {
          type:'oracle',
          host:config.get('DB_HOST')?.toString().trim(),
          port:Number(config.get('DB_PORT')?.toString().trim()),
          username:config.get('DB_USERNAME')?.toString().trim(),
          password:config.get('DB_PASSWORD')?.toString().trim(),
          serviceName:config.get('DB_SERVICE_NAME')?.toString().trim(),
          connectString: `${config.get('DB_HOST')?.toString().trim()}:${config.get('DB_PORT')?.toString().trim()}/${config.get('DB_SERVICE_NAME')?.toString().trim()}`,
          synchronize: config.get('DB_SYNCHRONIZE') ==='true',
          entities:[Grade],
          logging:true,
        }
      ),
    }),

  GradesModule,
  ],
  controllers:[AppController],
  providers:[AppService],
  })
export class AppModule {}
