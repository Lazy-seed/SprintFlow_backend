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
exports.SubtaskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let SubtaskService = class SubtaskService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(taskId, userId, createSubtaskDto) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        const isMember = task.column.board.workspace.members.some((member) => member.userId === userId);
        if (!isMember) {
            throw new common_1.ForbiddenException('You do not have access to this task');
        }
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
    async findAll(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        const isMember = task.column.board.workspace.members.some((member) => member.userId === userId);
        if (!isMember) {
            throw new common_1.ForbiddenException('You do not have access to this task');
        }
        return this.prisma.subtask.findMany({
            where: { parentTaskId: taskId },
            orderBy: { position: 'asc' },
        });
    }
    async update(id, userId, updateSubtaskDto) {
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
            throw new common_1.NotFoundException('Subtask not found');
        }
        const isMember = subtask.parentTask.column.board.workspace.members.some((member) => member.userId === userId);
        if (!isMember) {
            throw new common_1.ForbiddenException('You do not have access to this subtask');
        }
        return this.prisma.subtask.update({
            where: { id },
            data: updateSubtaskDto,
        });
    }
    async remove(id, userId) {
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
            throw new common_1.NotFoundException('Subtask not found');
        }
        const isMember = subtask.parentTask.column.board.workspace.members.some((member) => member.userId === userId);
        if (!isMember) {
            throw new common_1.ForbiddenException('You do not have access to this subtask');
        }
        return this.prisma.subtask.delete({
            where: { id },
        });
    }
};
exports.SubtaskService = SubtaskService;
exports.SubtaskService = SubtaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubtaskService);
//# sourceMappingURL=subtask.service.js.map