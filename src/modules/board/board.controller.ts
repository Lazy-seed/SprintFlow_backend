import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
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

    // ==================== COLUMN MANAGEMENT ENDPOINTS ====================

    /**
     * CREATE COLUMN - Add a new column to a board
     * 
     * ENDPOINT: POST /workspaces/:workspaceId/boards/:boardId/columns
     * 
     * DECORATORS EXPLAINED:
     * @Post('columns') - This endpoint responds to POST requests at /columns
     * @Param('id') - Extracts :boardId from the URL path
     * @CurrentUser() - Gets the authenticated user from JWT token
     * @Body() - Extracts and validates the request body against CreateColumnDto
     * 
     * FLOW:
     * 1. User sends POST request with column name and color
     * 2. JWT Guard verifies user is authenticated
     * 3. NestJS validates request body against CreateColumnDto
     * 4. Controller extracts boardId from URL and user from token
     * 5. Calls boardService.createColumn() with the data
     * 6. Service creates column and returns it
     * 7. Controller sends response back to client
     * 
     * EXAMPLE REQUEST:
     * POST /workspaces/abc123/boards/xyz789/columns
     * Body: { "name": "In Review", "color": "#3b82f6" }
     */
    @Post(':id/columns')
    createColumn(
        @Param('id') boardId: string,
        @CurrentUser() user: any,
        @Body() createColumnDto: CreateColumnDto,
    ) {
        return this.boardService.createColumn(boardId, user.id, createColumnDto);
    }

    /**
     * UPDATE COLUMN - Edit an existing column's name or color
     * 
     * ENDPOINT: PATCH /workspaces/:workspaceId/boards/:boardId/columns/:columnId
     * 
     * WHY PATCH INSTEAD OF PUT?
     * - PATCH = partial update (only send fields you want to change)
     * - PUT = full replacement (must send all fields)
     * - We use PATCH because users might only want to change name OR color
     * 
     * EXAMPLE REQUEST:
     * PATCH /workspaces/abc/boards/xyz/columns/col123
     * Body: { "name": "Code Review" }  // Only updating name, color stays same
     */
    @Patch(':id/columns/:columnId')
    updateColumn(
        @Param('columnId') columnId: string,
        @CurrentUser() user: any,
        @Body() updateColumnDto: UpdateColumnDto,
    ) {
        return this.boardService.updateColumn(columnId, user.id, updateColumnDto);
    }

    /**
     * DELETE COLUMN - Remove a column from the board
     * 
     * ENDPOINT: DELETE /workspaces/:workspaceId/boards/:boardId/columns/:columnId
     * 
     * QUERY PARAMETERS:
     * @Query('targetColumnId') - Optional parameter from URL query string
     * Example: DELETE /boards/xyz/columns/col1?targetColumnId=col2
     * 
     * WHY targetColumnId?
     * - When deleting a column, we need to move its tasks somewhere
     * - User can specify which column to move tasks to
     * - If not specified, tasks move to the first column
     * 
     * SAFETY:
     * - Can't delete the last column (board must have at least 1)
     * - All tasks are moved before deletion
     * - Operation is atomic (all or nothing)
     */
    @Delete(':id/columns/:columnId')
    deleteColumn(
        @Param('columnId') columnId: string,
        @CurrentUser() user: any,
        @Query('targetColumnId') targetColumnId?: string,
    ) {
        return this.boardService.deleteColumn(columnId, user.id, targetColumnId);
    }

    /**
     * REORDER COLUMNS - Change the order of columns on the board
     * 
     * ENDPOINT: PATCH /workspaces/:workspaceId/boards/:boardId/columns/reorder
     * 
     * HOW IT WORKS:
     * 1. Frontend sends array of column IDs in new order
     * 2. Backend updates position field for each column
     * 3. Positions are 0-indexed: [0, 1, 2, 3, ...]
     * 
     * WHY SEPARATE ENDPOINT?
     * - Reordering is a special operation affecting multiple columns
     * - It's not updating a single column, so it doesn't fit PATCH /:columnId
     * - Having a dedicated endpoint makes the API clearer
     * 
     * EXAMPLE REQUEST:
     * PATCH /workspaces/abc/boards/xyz/columns/reorder
     * Body: { "columnIds": ["col3", "col1", "col2"] }
     * Result: col3 gets position 0, col1 gets position 1, col2 gets position 2
     */
    @Patch(':id/columns/reorder')
    reorderColumns(
        @Param('id') boardId: string,
        @CurrentUser() user: any,
        @Body() reorderColumnsDto: ReorderColumnsDto,
    ) {
        return this.boardService.reorderColumns(boardId, user.id, reorderColumnsDto);
    }
}
