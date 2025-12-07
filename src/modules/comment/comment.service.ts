import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) { }

    async create(taskId: string, userId: string, createCommentDto: CreateCommentDto) {
        // Verify task exists and user has access
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                column: {
                    include: {
                        board: {
                            include: {
                                workspace: {
                                    include: {
                                        members: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        const isMember = task.column.board.workspace.members.some(
            (member) => member.userId === userId,
        );

        if (!isMember) {
            throw new ForbiddenException('You do not have access to this task');
        }

        return this.prisma.comment.create({
            data: {
                ...createCommentDto,
                taskId,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    async findAll(taskId: string, userId: string) {
        // Verify access
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                column: {
                    include: {
                        board: {
                            include: {
                                workspace: {
                                    include: {
                                        members: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        const isMember = task.column.board.workspace.members.some(
            (member) => member.userId === userId,
        );

        if (!isMember) {
            throw new ForbiddenException('You do not have access to this task');
        }

        return this.prisma.comment.findMany({
            where: { taskId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        // Only the author can update their comment
        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only edit your own comments');
        }

        return this.prisma.comment.update({
            where: { id },
            data: updateCommentDto,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    async remove(id: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        // Only the author can delete their comment
        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        return this.prisma.comment.delete({
            where: { id },
        });
    }
}
