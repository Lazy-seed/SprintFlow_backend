import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';

@Injectable()
export class BoardService {
    constructor(private prisma: PrismaService) { }

    async create(workspaceId: string, userId: string, createBoardDto: CreateBoardDto) {
        // Verify user has access to workspace
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                members: {
                    some: { userId },
                },
            },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }

        // Get max position
        const maxPosition = await this.prisma.board.findFirst({
            where: { workspaceId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });

        const position = createBoardDto.position ?? (maxPosition?.position ?? 0) + 1;

        // Create board with default columns
        const board = await this.prisma.board.create({
            data: {
                workspaceId,
                name: createBoardDto.name,
                description: createBoardDto.description,
                isPrivate: createBoardDto.isPrivate ?? false,
                position,
                createdBy: userId,
                columns: {
                    create: [
                        { name: 'To Do', position: 1, color: '#6b7280' },
                        { name: 'In Progress', position: 2, color: '#3b82f6' },
                        { name: 'Done', position: 3, color: '#10b981' },
                    ],
                },
            },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                },
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        return board;
    }

    async findAllByWorkspace(workspaceId: string, userId: string) {
        // Verify access
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                members: {
                    some: { userId },
                },
            },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }

        const boards = await this.prisma.board.findMany({
            where: {
                workspaceId,
                archivedAt: null,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                        columns: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        });

        return boards;
    }

    async findOne(id: string, userId: string) {
        const board = await this.prisma.board.findFirst({
            where: {
                id,
                workspace: {
                    members: {
                        some: { userId },
                    },
                },
            },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        tasks: {
                            where: { completedAt: null },
                            orderBy: { position: 'asc' },
                            include: {
                                assignee: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        avatarUrl: true,
                                    },
                                },
                                tags: {
                                    include: {
                                        tag: true,
                                    },
                                },
                                _count: {
                                    select: {
                                        subtasks: true,
                                        comments: true,
                                    },
                                },
                            },
                        },
                    },
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        return board;
    }

    async remove(id: string, userId: string) {
        const board = await this.prisma.board.findFirst({
            where: {
                id,
                workspace: {
                    members: {
                        some: { userId },
                    },
                },
            },
            include: {
                workspace: true,
            },
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        // Only workspace owner or board creator can delete
        if (board.workspace.ownerId !== userId && board.createdBy !== userId) {
            throw new ForbiddenException('Only workspace owner or board creator can delete');
        }

        await this.prisma.board.delete({ where: { id } });

        return { message: 'Board deleted successfully' };
    }

    // ==================== COLUMN MANAGEMENT METHODS ====================

    /**
     * CREATE COLUMN - Add a new column to a board
     * 
     * WHAT THIS METHOD DOES:
     * 1. Verifies user has access to the board
     * 2. Calculates the next position for the new column
     * 3. Creates the column in the database
     * 4. Returns the created column
     * 
     * PRISMA CONCEPTS:
     * - findFirst() - Finds the first record matching the where clause
     * - create() - Creates a new record in the database
     * - orderBy - Sorts results (desc = descending, highest first)
     * 
     * @param boardId - UUID of the board to add column to
     * @param userId - UUID of the user making the request
     * @param createColumnDto - Data for the new column (name, color)
     * @returns The newly created column object
     */
    async createColumn(boardId: string, userId: string, createColumnDto: CreateColumnDto) {
        // STEP 1: Verify user has access to this board
        // We check if the board exists AND if the user is a member of its workspace
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                workspace: {
                    members: {
                        // some: means "at least one member matches this condition"
                        some: { userId },
                    },
                },
            },
        });

        // If board doesn't exist or user doesn't have access, throw error
        if (!board) {
            throw new NotFoundException('Board not found');
        }

        // STEP 2: Calculate position for new column
        // We want to add it at the end, so we find the highest position
        const maxPosition = await this.prisma.boardColumn.findFirst({
            where: { boardId },
            orderBy: { position: 'desc' }, // desc = descending (highest first)
            select: { position: true }, // Only get the position field
        });

        // If there are existing columns, add 1 to max position
        // If no columns exist, start at position 0
        // The ?? operator is "nullish coalescing" - if left side is null/undefined, use right side
        const position = (maxPosition?.position ?? -1) + 1;

        // STEP 3: Create the column
        const column = await this.prisma.boardColumn.create({
            data: {
                boardId,
                name: createColumnDto.name,
                // Use provided color, or default to gray if not provided
                color: createColumnDto.color ?? '#6b7280',
                position,
            },
        });

        return column;
    }

    /**
     * UPDATE COLUMN - Edit column name or color
     * 
     * WHAT THIS METHOD DOES:
     * 1. Finds the column and verifies user access
     * 2. Updates only the fields that were provided
     * 3. Returns the updated column
     * 
     * TYPESCRIPT CONCEPTS:
     * - Partial<T> - Makes all properties of type T optional
     * - Object spread {...} - Copies properties from one object to another
     * 
     * @param columnId - UUID of the column to update
     * @param userId - UUID of the user making the request
     * @param updateColumnDto - Fields to update (name?, color?)
     * @returns The updated column object
     */
    async updateColumn(columnId: string, userId: string, updateColumnDto: UpdateColumnDto) {
        // STEP 1: Find column and verify access
        // We use include to also fetch related board and workspace data
        const column = await this.prisma.boardColumn.findFirst({
            where: {
                id: columnId,
                board: {
                    workspace: {
                        members: {
                            some: { userId },
                        },
                    },
                },
            },
        });

        if (!column) {
            throw new NotFoundException('Column not found');
        }

        // STEP 2: Update the column
        // Only the fields in updateColumnDto will be updated
        // If name is not provided, it stays the same
        // If color is not provided, it stays the same
        const updatedColumn = await this.prisma.boardColumn.update({
            where: { id: columnId },
            data: updateColumnDto, // This contains only the fields to update
        });

        return updatedColumn;
    }

    /**
     * DELETE COLUMN - Remove a column and migrate its tasks
     * 
     * WHAT THIS METHOD DOES:
     * 1. Verifies user access and column exists
     * 2. Checks if this is the last column (can't delete last column)
     * 3. Moves all tasks from this column to target column
     * 4. Deletes the column
     * 5. Updates positions of remaining columns
     * 
     * PRISMA TRANSACTIONS:
     * - $transaction() - Runs multiple operations atomically
     * - If ANY operation fails, ALL operations are rolled back
     * - This ensures data consistency
     * 
     * WHY USE TRANSACTIONS?
     * - We're doing multiple operations: move tasks, delete column, update positions
     * - If delete fails after moving tasks, we'd have inconsistent data
     * - Transaction ensures all-or-nothing: either everything succeeds or nothing changes
     * 
     * @param columnId - UUID of the column to delete
     * @param userId - UUID of the user making the request
     * @param targetColumnId - Optional UUID of column to move tasks to
     * @returns Success message
     */
    async deleteColumn(columnId: string, userId: string, targetColumnId?: string) {
        // STEP 1: Find column and verify access
        const column = await this.prisma.boardColumn.findFirst({
            where: {
                id: columnId,
                board: {
                    workspace: {
                        members: {
                            some: { userId },
                        },
                    },
                },
            },
            include: {
                board: {
                    include: {
                        columns: true, // Get all columns of this board
                    },
                },
            },
        });

        if (!column) {
            throw new NotFoundException('Column not found');
        }

        // STEP 2: Safety check - can't delete the last column
        // A board must always have at least one column
        if (column.board.columns.length === 1) {
            throw new BadRequestException('Cannot delete the last column. Board must have at least one column.');
        }

        // STEP 3: Determine where to move tasks
        let targetId = targetColumnId;

        // If no target specified, move to the first column that isn't this one
        if (!targetId) {
            const firstOtherColumn = column.board.columns.find(col => col.id !== columnId);
            targetId = firstOtherColumn!.id; // ! means "I'm sure this exists"
        }

        // Verify target column exists and is on the same board
        const targetColumn = column.board.columns.find(col => col.id === targetId);
        if (!targetColumn) {
            throw new BadRequestException('Target column not found or not on the same board');
        }

        // STEP 4: Execute deletion in a transaction
        // This ensures all operations succeed or all fail together
        await this.prisma.$transaction(async (tx) => {
            // 4a. Move all tasks from deleted column to target column
            await tx.task.updateMany({
                where: { columnId },
                data: { columnId: targetId },
            });

            // 4b. Delete the column
            await tx.boardColumn.delete({
                where: { id: columnId },
            });

            // 4c. Update positions of remaining columns
            // Get all columns with position greater than the deleted column
            const columnsToUpdate = column.board.columns
                .filter(col => col.id !== columnId && col.position > column.position);

            // Decrease their position by 1 to fill the gap
            for (const col of columnsToUpdate) {
                await tx.boardColumn.update({
                    where: { id: col.id },
                    data: { position: col.position - 1 },
                });
            }
        });

        return { message: 'Column deleted successfully' };
    }

    /**
     * REORDER COLUMNS - Change the order of columns
     * 
     * WHAT THIS METHOD DOES:
     * 1. Receives array of column IDs in new order
     * 2. Updates position field for each column
     * 3. Returns updated columns
     * 
     * HOW POSITIONS WORK:
     * - Positions are 0-indexed: 0, 1, 2, 3, ...
     * - Lower number = appears first
     * - Frontend sends IDs in visual order: [col3, col1, col2]
     * - We update: col3.position = 0, col1.position = 1, col2.position = 2
     * 
     * ARRAY METHODS:
     * - map() - Transforms each item in an array
     * - findIndex() - Finds the index of an item
     * 
     * @param boardId - UUID of the board
     * @param userId - UUID of the user making the request
     * @param reorderColumnsDto - Object containing array of column IDs in new order
     * @returns Array of updated columns
     */
    async reorderColumns(boardId: string, userId: string, reorderColumnsDto: ReorderColumnsDto) {
        // STEP 1: Verify user has access to board
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                workspace: {
                    members: {
                        some: { userId },
                    },
                },
            },
            include: {
                columns: true,
            },
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        // STEP 2: Validate that all column IDs belong to this board
        const { columnIds } = reorderColumnsDto;

        // Check if number of IDs matches number of columns
        if (columnIds.length !== board.columns.length) {
            throw new BadRequestException('Column IDs count does not match board columns count');
        }

        // Check if all IDs are valid and belong to this board
        const boardColumnIds = board.columns.map(col => col.id);
        const allIdsValid = columnIds.every(id => boardColumnIds.includes(id));

        if (!allIdsValid) {
            throw new BadRequestException('Some column IDs are invalid or do not belong to this board');
        }

        // STEP 3: Update positions in a transaction
        await this.prisma.$transaction(async (tx) => {
            // For each column ID in the new order
            for (let i = 0; i < columnIds.length; i++) {
                // Update its position to match its index in the array
                await tx.boardColumn.update({
                    where: { id: columnIds[i] },
                    data: { position: i },
                });
            }
        });

        // STEP 4: Fetch and return updated columns in new order
        const updatedColumns = await this.prisma.boardColumn.findMany({
            where: { boardId },
            orderBy: { position: 'asc' }, // asc = ascending (lowest first)
        });

        return updatedColumns;
    }
}
