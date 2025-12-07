import { PrismaService } from '../../database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
export declare class WorkspaceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createWorkspaceDto: CreateWorkspaceDto): Promise<{
        owner: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
        members: ({
            user: {
                id: string;
                email: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            workspaceId: string;
            userId: string;
            role: string;
            invitedAt: Date;
            joinedAt: Date | null;
            invitedBy: string | null;
        })[];
    } & {
        name: string;
        id: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        planTier: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue;
    }>;
    findAllByUser(userId: string): Promise<({
        owner: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
        _count: {
            members: number;
            boards: number;
        };
    } & {
        name: string;
        id: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        planTier: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        owner: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
        members: ({
            user: {
                id: string;
                email: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            workspaceId: string;
            userId: string;
            role: string;
            invitedAt: Date;
            joinedAt: Date | null;
            invitedBy: string | null;
        })[];
        boards: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            workspaceId: string;
            position: number;
            isPrivate: boolean;
            isTemplate: boolean;
            backgroundColor: string;
            createdBy: string;
            archivedAt: Date | null;
        }[];
    } & {
        name: string;
        id: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
        planTier: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    private generateUniqueSlug;
}
