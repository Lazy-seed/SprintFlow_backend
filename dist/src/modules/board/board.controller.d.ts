import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
export declare class BoardController {
    private readonly boardService;
    constructor(boardService: BoardService);
    create(workspaceId: string, user: any, createBoardDto: CreateBoardDto): Promise<{
        creator: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
        columns: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            boardId: string;
            position: number;
            color: string;
            wipLimit: number | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        workspaceId: string;
        position: number;
        isPrivate: boolean;
        isTemplate: boolean;
        backgroundColor: string;
        createdBy: string;
        archivedAt: Date | null;
    }>;
    findAll(workspaceId: string, user: any): Promise<({
        _count: {
            columns: number;
            tasks: number;
        };
        creator: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        workspaceId: string;
        position: number;
        isPrivate: boolean;
        isTemplate: boolean;
        backgroundColor: string;
        createdBy: string;
        archivedAt: Date | null;
    })[]>;
    findOne(id: string, user: any): Promise<{
        workspace: {
            name: string;
            id: string;
            slug: string;
        };
        columns: ({
            tasks: ({
                tags: ({
                    tag: {
                        name: string;
                        id: string;
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
                _count: {
                    comments: number;
                    subtasks: number;
                };
                assignee: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                boardId: string;
                columnId: string;
                title: string;
                priority: string;
                taskNumber: string;
                dueDate: Date | null;
                startDate: Date | null;
                assigneeId: string | null;
                reporterId: string;
                position: number;
                estimatedHours: number | null;
                actualHours: number | null;
                completedAt: Date | null;
            })[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            boardId: string;
            position: number;
            color: string;
            wipLimit: number | null;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        workspaceId: string;
        position: number;
        isPrivate: boolean;
        isTemplate: boolean;
        backgroundColor: string;
        createdBy: string;
        archivedAt: Date | null;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
