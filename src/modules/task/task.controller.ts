import {
    Controller,
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
        @CurrentUser() user: any,
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.taskService.create(boardId, user.id, createTaskDto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.taskService.update(id, user.id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.taskService.remove(id, user.id);
    }
}
