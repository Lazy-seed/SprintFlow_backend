import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private pool;
    private prisma;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get client(): PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
    get user(): import("@prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get workspace(): import("@prisma/client").Prisma.WorkspaceDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get board(): import("@prisma/client").Prisma.BoardDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get task(): import("@prisma/client").Prisma.TaskDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get comment(): import("@prisma/client").Prisma.CommentDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get subtask(): import("@prisma/client").Prisma.SubtaskDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get boardColumn(): import("@prisma/client").Prisma.BoardColumnDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get workspaceMember(): import("@prisma/client").Prisma.WorkspaceMemberDelegate<import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get $transaction(): any;
}
