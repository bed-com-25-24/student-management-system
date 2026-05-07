import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
} from '@nestjs/common';
import { ClassService } from './classes.service';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classService: ClassService) { }

    @Get()
    findAll() {
        return this.classService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.classService.findById(+id);
    }

    @Post()
    create(@Body() dto: { id: number; name: string }) {
        return this.classService.createClass(dto.id, dto.name);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: { name: string }) {
        return this.classService.updateClass(+id, dto.name);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.classService.deleteClass(+id);
    }
}
