import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createWorkspaceDto: CreateWorkspaceDto) {
        // Generate slug from name
        const slug = createWorkspaceDto.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Ensure unique slug
        const uniqueSlug = await this.generateUniqueSlug(slug);

        // Create workspace with owner as member
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

    async findAllByUser(userId: string) {
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

    async findOne(id: string, userId: string) {
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
            throw new NotFoundException('Workspace not found');
        }

        return workspace;
    }

    async remove(id: string, userId: string) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }

        if (workspace.ownerId !== userId) {
            throw new ForbiddenException('Only workspace owner can delete it');
        }

        await this.prisma.workspace.delete({
            where: { id },
        });

        return { message: 'Workspace deleted successfully' };
    }

    private async generateUniqueSlug(baseSlug: string): Promise<string> {
        let slug = baseSlug;
        let counter = 1;

        while (await this.prisma.workspace.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }
}
