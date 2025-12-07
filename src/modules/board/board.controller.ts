import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('workspaces/:workspaceId/boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
    constructor(private readonly boardService: BoardService) { }

    @Post()
    create(
        @Param('workspaceId') workspaceId: string,
        @CurrentUser() user: any,
        @Body() createBoardDto: CreateBoardDto,
    ) {
        return this.boardService.create(workspaceId, user.id, createBoardDto);
    }

    @Get()
    findAll(@Param('workspaceId') workspaceId: string, @CurrentUser() user: any) {
        return this.boardService.findAllByWorkspace(workspaceId, user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.boardService.findOne(id, user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.boardService.remove(id, user.id);
    }
}
