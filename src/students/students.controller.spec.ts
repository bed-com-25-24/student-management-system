import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentService } from './students.service';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';
import { User } from './entities/user.entity';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [Student, Class, User],
        }),
        TypeOrmModule.forFeature([Student]),
      ],
      controllers: [StudentsController],
      providers: [StudentService],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
