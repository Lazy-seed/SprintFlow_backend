import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('boards/:boardId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    create(
        @Param('boardId') boardId: string,
        @CurrentUser('id') userId: string,
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.taskService.create(boardId, userId, createTaskDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.taskService.findOne(id, userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.taskService.update(id, userId, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.taskService.remove(id, user.id);
    }
}
