import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // POST /api/v1/users — admin only
    @UseGuards(RolesGuard)
    @Roles('admin', 'headteacher')
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // GET /api/v1/users — list all teachers
    @Get()
    findAll(@Query() query: any) {
        return this.usersService.findAll();
    }

    // GET /api/v1/users/:id
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    // PUT /api/v1/users/:id
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }

    // DELETE /api/v1/users/:id — admin only
    @UseGuards(RolesGuard)
    @Roles('admin')
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }

    // GET /api/v1/users/:id/subjects
    @Get(':id/subjects')
    getSubjects(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getSubjects(id);
    }

    // GET /api/v1/users/:id/class
    @Get(':id/class')
    getClass(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getClass(id);
    }

    // POST /api/v1/users/:id/subjects — admin only
    @UseGuards(RolesGuard)
    @Roles('admin', 'headteacher')
    @Post(':id/subjects')
    assignSubjects(@Param('id', ParseIntPipe) id: number, @Body() body: { subjectIds: number[] }) {
        return this.usersService.assignSubjects(id, body.subjectIds);
    }

    // PUT /api/v1/users/:id/class — admin only
    @UseGuards(RolesGuard)
    @Roles('admin', 'headteacher')
    @Put(':id/class')
    assignClass(@Param('id', ParseIntPipe) id: number, @Body() body: { classId: number }) {
        return this.usersService.assignClass(id, body.classId);
    }
}

