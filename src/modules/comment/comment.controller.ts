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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    create(
        @Param('taskId') taskId: string,
        @CurrentUser('id') userId: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.commentService.create(taskId, userId, createCommentDto);
    }

    @Get()
    findAll(
        @Param('taskId') taskId: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.commentService.findAll(taskId, userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentService.update(id, userId, updateCommentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.commentService.remove(id, userId);
    }
}
