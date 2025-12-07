import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtaskService {
    constructor(private prisma: PrismaService) { }

    async create(taskId: string, userId: string, createSubtaskDto: CreateSubtaskDto) {
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

        // Get the highest position
        const lastSubtask = await this.prisma.subtask.findFirst({
            where: { parentTaskId: taskId },
            orderBy: { position: 'desc' },
        });

        const position = lastSubtask ? lastSubtask.position + 1 : 0;

        return this.prisma.subtask.create({
            data: {
                ...createSubtaskDto,
                parentTaskId: taskId,
                position,
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

        return this.prisma.subtask.findMany({
            where: { parentTaskId: taskId },
            orderBy: { position: 'asc' },
        });
    }

    async update(id: string, userId: string, updateSubtaskDto: UpdateSubtaskDto) {
        const subtask = await this.prisma.subtask.findUnique({
            where: { id },
            include: {
                parentTask: {
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
                },
            },
        });

        if (!subtask) {
            throw new NotFoundException('Subtask not found');
        }

        const isMember = subtask.parentTask.column.board.workspace.members.some(
            (member) => member.userId === userId,
        );

        if (!isMember) {
            throw new ForbiddenException('You do not have access to this subtask');
        }

        return this.prisma.subtask.update({
            where: { id },
            data: updateSubtaskDto,
        });
    }

    async remove(id: string, userId: string) {
        const subtask = await this.prisma.subtask.findUnique({
            where: { id },
            include: {
                parentTask: {
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
                },
            },
        });

        if (!subtask) {
            throw new NotFoundException('Subtask not found');
        }

        const isMember = subtask.parentTask.column.board.workspace.members.some(
            (member) => member.userId === userId,
        );

        if (!isMember) {
            throw new ForbiddenException('You do not have access to this subtask');
        }

        return this.prisma.subtask.delete({
            where: { id },
        });
    }
}
