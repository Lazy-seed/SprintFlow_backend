import { PrismaService } from '../../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(taskId: string, userId: string, createCommentDto: CreateCommentDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        taskId: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        taskId: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        taskId: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        taskId: string;
        content: string;
        mentions: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
