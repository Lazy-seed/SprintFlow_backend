import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(taskId: string, userId: string, createCommentDto: CreateCommentDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        taskId: string;
        userId: string;
    }>;
    findAll(taskId: string, userId: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        taskId: string;
        userId: string;
    })[]>;
    update(id: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        taskId: string;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        taskId: string;
        userId: string;
    }>;
}
