import { PrismaService } from '../../database/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
export declare class SubtaskService {
    private prisma;
    constructor(prisma: PrismaService);
    create(taskId: string, userId: string, createSubtaskDto: CreateSubtaskDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        position: number;
        completedAt: Date | null;
        parentTaskId: string;
        isCompleted: boolean;
    }>;
    findAll(taskId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        position: number;
        completedAt: Date | null;
        parentTaskId: string;
        isCompleted: boolean;
    }[]>;
    update(id: string, userId: string, updateSubtaskDto: UpdateSubtaskDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        position: number;
        completedAt: Date | null;
        parentTaskId: string;
        isCompleted: boolean;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        position: number;
        completedAt: Date | null;
        parentTaskId: string;
        isCompleted: boolean;
    }>;
}
