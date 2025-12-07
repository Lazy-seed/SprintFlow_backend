import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async create(boardId: string, userId: string, createTaskDto: CreateTaskDto) {
        // Verify board access
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                workspace: {
                    members: {
                        some: { userId },
                    },
                },
            },
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        // Get next task number for this board
        const lastTask = await this.prisma.task.findFirst({
            where: { boardId },
            orderBy: { createdAt: 'desc' },
            select: { taskNumber: true },
        });

        const taskNumber = lastTask
            ? `TASK-${parseInt(lastTask.taskNumber.split('-')[1]) + 1}`
            : 'TASK-1';

        // Get max position in column
        const maxPosition = await this.prisma.task.findFirst({
            where: { columnId: createTaskDto.columnId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });

        const position = (maxPosition?.position ?? 0) + 1;

        const task = await this.prisma.task.create({
            data: {
                boardId,
                columnId: createTaskDto.columnId,
                title: createTaskDto.title,
                description: createTaskDto.description,
                priority: createTaskDto.priority ?? 'medium',
                taskNumber,
                position,
                reporterId: userId,
                assigneeId: createTaskDto.assigneeId,
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                reporter: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        return task;
    }

    async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                board: {
                    workspace: {
                        members: {
                            some: { userId },
                        },
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        const updated = await this.prisma.task.update({
            where: { id },
            data: updateTaskDto,
            include: {
                assignee: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                reporter: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        return updated;
    }

    async remove(id: string, userId: string) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                board: {
                    workspace: {
                        members: {
                            some: { userId },
                        },
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        await this.prisma.task.delete({ where: { id } });

        return { message: 'Task deleted successfully' };
    }
}
