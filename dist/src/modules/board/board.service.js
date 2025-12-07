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
exports.BoardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let BoardService = class BoardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, userId, createBoardDto) {
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                members: {
                    some: { userId },
                },
            },
        });
        if (!workspace) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        const maxPosition = await this.prisma.board.findFirst({
            where: { workspaceId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });
        const position = createBoardDto.position ?? (maxPosition?.position ?? 0) + 1;
        const board = await this.prisma.board.create({
            data: {
                workspaceId,
                name: createBoardDto.name,
                description: createBoardDto.description,
                isPrivate: createBoardDto.isPrivate ?? false,
                position,
                createdBy: userId,
                columns: {
                    create: [
                        { name: 'To Do', position: 1, color: '#6b7280' },
                        { name: 'In Progress', position: 2, color: '#3b82f6' },
                        { name: 'Done', position: 3, color: '#10b981' },
                    ],
                },
            },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                },
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        return board;
    }
    async findAllByWorkspace(workspaceId, userId) {
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                members: {
                    some: { userId },
                },
            },
        });
        if (!workspace) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        const boards = await this.prisma.board.findMany({
            where: {
                workspaceId,
                archivedAt: null,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                        columns: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        });
        return boards;
    }
    async findOne(id, userId) {
        const board = await this.prisma.board.findFirst({
            where: {
                id,
                workspace: {
                    members: {
                        some: { userId },
                    },
                },
            },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        tasks: {
                            where: { completedAt: null },
                            orderBy: { position: 'asc' },
                            include: {
                                assignee: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        avatarUrl: true,
                                    },
                                },
                                tags: {
                                    include: {
                                        tag: true,
                                    },
                                },
                                _count: {
                                    select: {
                                        subtasks: true,
                                        comments: true,
                                    },
                                },
                            },
                        },
                    },
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        return board;
    }
    async remove(id, userId) {
        const board = await this.prisma.board.findFirst({
            where: {
                id,
                workspace: {
                    members: {
                        some: { userId },
                    },
                },
            },
            include: {
                workspace: true,
            },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.workspace.ownerId !== userId && board.createdBy !== userId) {
            throw new common_1.ForbiddenException('Only workspace owner or board creator can delete');
        }
        await this.prisma.board.delete({ where: { id } });
        return { message: 'Board deleted successfully' };
    }
};
exports.BoardService = BoardService;
exports.BoardService = BoardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardService);
//# sourceMappingURL=board.service.js.map