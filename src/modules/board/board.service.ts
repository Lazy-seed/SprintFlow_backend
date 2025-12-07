import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
    constructor(private prisma: PrismaService) { }

    async create(workspaceId: string, userId: string, createBoardDto: CreateBoardDto) {
        // Verify user has access to workspace
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                members: {
                    some: { userId },
                },
            },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }

        // Get max position
        const maxPosition = await this.prisma.board.findFirst({
            where: { workspaceId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });

        const position = createBoardDto.position ?? (maxPosition?.position ?? 0) + 1;

        // Create board with default columns
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

    async findAllByWorkspace(workspaceId: string, userId: string) {
        // Verify access
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                members: {
                    some: { userId },
                },
            },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
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

    async findOne(id: string, userId: string) {
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
            throw new NotFoundException('Board not found');
        }

        return board;
    }

    async remove(id: string, userId: string) {
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
            throw new NotFoundException('Board not found');
        }

        // Only workspace owner or board creator can delete
        if (board.workspace.ownerId !== userId && board.createdBy !== userId) {
            throw new ForbiddenException('Only workspace owner or board creator can delete');
        }

        await this.prisma.board.delete({ where: { id } });

        return { message: 'Board deleted successfully' };
    }
}
