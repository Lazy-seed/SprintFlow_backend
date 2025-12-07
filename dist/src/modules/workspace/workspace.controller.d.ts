import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    create(user: any, createWorkspaceDto: CreateWorkspaceDto): Promise<{
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
            role: string;
            invitedAt: Date;
            joinedAt: Date | null;
            invitedBy: string | null;
            userId: string;
            workspaceId: string;
        })[];
    } & {
        id: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        planTier: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue;
        ownerId: string;
    }>;
    findAll(user: any): Promise<({
        _count: {
            members: number;
            boards: number;
        };
        owner: {
            id: string;
            email: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        planTier: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue;
        ownerId: string;
    })[]>;
    findOne(id: string, user: any): Promise<{
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
            role: string;
            invitedAt: Date;
            joinedAt: Date | null;
            invitedBy: string | null;
            userId: string;
            workspaceId: string;
        })[];
        boards: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            archivedAt: Date | null;
            position: number;
            workspaceId: string;
            isPrivate: boolean;
            isTemplate: boolean;
            backgroundColor: string;
            createdBy: string;
        }[];
    } & {
        id: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        planTier: string;
        description: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue;
        ownerId: string;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
