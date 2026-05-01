import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Grade} from './entities/Grade.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Grade])],
  controllers:[GradesController],
  providers:[GradesService],
})
export class GradesModule {}
