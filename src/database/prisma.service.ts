import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    private prisma: PrismaClient;

    constructor() {
        // Create PostgreSQL connection pool
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        // Create Prisma adapter
        const adapter = new PrismaPg(this.pool);

        // Initialize Prisma Client with adapter (required in Prisma 7)
        this.prisma = new PrismaClient({ adapter });
    }

    async onModuleInit() {
        await this.prisma.$connect();
        console.log('✅ Database connected successfully');
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
        await this.pool.end();
        console.log('👋 Database disconnected');
    }

    // Expose Prisma client methods
    get client() {
        return this.prisma;
    }

    // Proxy common Prisma methods for convenience
    get user() {
        return this.prisma.user;
    }

    get workspace() {
        return this.prisma.workspace;
    }

    get board() {
        return this.prisma.board;
    }

    get task() {
        return this.prisma.task;
    }

    get comment() {
        return this.prisma.comment;
    }

    // Add other models as needed
    get $transaction() {
        return this.prisma.$transaction.bind(this.prisma);
    }
}
