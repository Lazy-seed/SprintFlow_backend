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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let WorkspaceService = class WorkspaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createWorkspaceDto) {
        const slug = createWorkspaceDto.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const uniqueSlug = await this.generateUniqueSlug(slug);
        const workspace = await this.prisma.workspace.create({
            data: {
                name: createWorkspaceDto.name,
                slug: uniqueSlug,
                description: createWorkspaceDto.description,
                ownerId: userId,
                planTier: 'free',
                members: {
                    create: {
                        userId: userId,
                        role: 'owner',
                        joinedAt: new Date(),
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });
        return workspace;
    }
    async findAllByUser(userId) {
        const workspaces = await this.prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        members: true,
                        boards: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return workspaces;
    }
    async findOne(id, userId) {
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id,
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                boards: {
                    where: {
                        archivedAt: null,
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
        if (!workspace) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return workspace;
    }
    async remove(id, userId) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
        });
        if (!workspace) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        if (workspace.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only workspace owner can delete it');
        }
        await this.prisma.workspace.delete({
            where: { id },
        });
        return { message: 'Workspace deleted successfully' };
    }
    async generateUniqueSlug(baseSlug) {
        let slug = baseSlug;
        let counter = 1;
        while (await this.prisma.workspace.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return slug;
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map