import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('tasks/:taskId/subtasks')
@UseGuards(JwtAuthGuard)
export class SubtaskController {
    constructor(private readonly subtaskService: SubtaskService) { }

    @Post()
    create(
        @Param('taskId') taskId: string,
        @CurrentUser('id') userId: string,
        @Body() createSubtaskDto: CreateSubtaskDto,
    ) {
        return this.subtaskService.create(taskId, userId, createSubtaskDto);
    }

    @Get()
    findAll(
        @Param('taskId') taskId: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.subtaskService.findAll(taskId, userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() updateSubtaskDto: UpdateSubtaskDto,
    ) {
        return this.subtaskService.update(id, userId, updateSubtaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.subtaskService.remove(id, userId);
    }
}
