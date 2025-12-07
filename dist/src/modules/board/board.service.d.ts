import { PrismaService } from '../../database/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
export declare class BoardService {
    private prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, userId: string, createBoardDto: CreateBoardDto): Promise<{
        creator: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
        columns: {
            id: string;
            name: string;
            position: number;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            wipLimit: number | null;
            boardId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        isPrivate: boolean;
        isTemplate: boolean;
        backgroundColor: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        archivedAt: Date | null;
        workspaceId: string;
        createdBy: string;
    }>;
    findAllByWorkspace(workspaceId: string, userId: string): Promise<({
        creator: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
        _count: {
            columns: number;
            tasks: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        isPrivate: boolean;
        isTemplate: boolean;
        backgroundColor: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        archivedAt: Date | null;
        workspaceId: string;
        createdBy: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        workspace: {
            id: string;
            name: string;
            slug: string;
        };
        columns: ({
            tasks: ({
                _count: {
                    comments: number;
                    subtasks: number;
                };
                tags: ({
                    tag: {
                        id: string;
                        name: string;
                        createdAt: Date;
                        workspaceId: string;
                        color: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    taskId: string;
                    tagId: string;
                })[];
                assignee: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                description: string | null;
                position: number;
                createdAt: Date;
                updatedAt: Date;
                boardId: string;
                completedAt: Date | null;
                columnId: string;
                title: string;
                priority: string;
                taskNumber: string;
                dueDate: Date | null;
                startDate: Date | null;
                assigneeId: string | null;
                reporterId: string;
                estimatedHours: number | null;
                actualHours: number | null;
            })[];
        } & {
            id: string;
            name: string;
            position: number;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            wipLimit: number | null;
            boardId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        isPrivate: boolean;
        isTemplate: boolean;
        backgroundColor: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        archivedAt: Date | null;
        workspaceId: string;
        createdBy: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    createColumn(boardId: string, userId: string, createColumnDto: CreateColumnDto): Promise<{
        id: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        wipLimit: number | null;
        boardId: string;
    }>;
    updateColumn(columnId: string, userId: string, updateColumnDto: UpdateColumnDto): Promise<{
        id: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        wipLimit: number | null;
        boardId: string;
    }>;
    deleteColumn(columnId: string, userId: string, targetColumnId?: string): Promise<{
        message: string;
    }>;
    reorderColumns(boardId: string, userId: string, reorderColumnsDto: ReorderColumnsDto): Promise<{
        id: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        wipLimit: number | null;
        boardId: string;
    }[]>;
}
