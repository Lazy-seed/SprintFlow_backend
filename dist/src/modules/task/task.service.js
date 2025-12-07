"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let TaskService = class TaskService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(boardId, userId, createTaskDto) {
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
            throw new common_1.NotFoundException('Board not found');
        }
        const lastTask = await this.prisma.task.findFirst({
            where: { boardId },
            orderBy: { createdAt: 'desc' },
            select: { taskNumber: true },
        });
        const taskNumber = lastTask
            ? `TASK-${parseInt(lastTask.taskNumber.split('-')[1]) + 1}`
            : 'TASK-1';
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
    async findOne(id, userId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                board: {
                    workspace: {
                        members: {
                            some: {
                                userId: userId
                            },
                        },
                    },
                },
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
                subtasks: {
                    orderBy: { position: 'asc' },
                },
                comments: {
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
                },
                _count: {
                    select: {
                        subtasks: true,
                        comments: true,
                    },
                },
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async update(id, userId, updateTaskDto) {
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
            throw new common_1.NotFoundException('Task not found');
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
                subtasks: {
                    orderBy: { position: 'asc' },
                },
                comments: {
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
                },
                _count: {
                    select: {
                        subtasks: true,
                        comments: true,
                    },
                },
            },
        });
        return updated;
    }
    async remove(id, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.prisma.task.delete({ where: { id } });
        return { message: 'Task deleted successfully' };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskService);
//# sourceMappingURL=task.service.js.map