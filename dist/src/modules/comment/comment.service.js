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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CommentService = class CommentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(taskId, userId, createCommentDto) {
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
    async update(id, userId, updateCommentDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
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
    async remove(id, userId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        return this.prisma.comment.delete({
            where: { id },
        });
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentService);
//# sourceMappingURL=comment.service.js.map