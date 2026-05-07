import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassService implements OnModuleInit {
    private readonly logger = new Logger(ClassService.name);

    constructor(
        @InjectRepository(Class)
        private classRepo: Repository<Class>,
    ) { }

    async onModuleInit() {
        await this.seedClasses();
    }

    // Ensure Std 1 to 8 exist in the DB on startup
    private async seedClasses() {
        for (let id = 1; id <= 8; id++) {
            const exists = await this.classRepo.findOne({ where: { id } });
            if (!exists) {
                await this.classRepo.save({
                    id,
                    name: `Std ${id}`,
                });
                this.logger.log(`Created missing basic class: Std ${id}`);
            }
        }
    }

    async findAll() {
        return this.classRepo.find({ order: { id: 'ASC' } });
    }

    async findById(id: number) {
        return this.classRepo.findOne({ where: { id } });
    }

    async createClass(id: number, name: string) {
        const newClass = this.classRepo.create({ id, name });
        return this.classRepo.save(newClass);
    }

    async updateClass(id: number, name: string) {
        await this.classRepo.update(id, { name });
        return this.findById(id);
    }

    async deleteClass(id: number) {
        await this.classRepo.delete(id);
        return { message: 'Class deleted successfully' };
    }
}
