import { PrismaService } from '../../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskService {
    private prisma;
    constructor(prisma: PrismaService);
    create(boardId: string, userId: string, createTaskDto: CreateTaskDto): Promise<{
        assignee: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        reporter: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        boardId: string;
        columnId: string;
        title: string;
        priority: string;
        taskNumber: string;
        dueDate: Date | null;
        startDate: Date | null;
        assigneeId: string | null;
        reporterId: string;
        position: number;
        estimatedHours: number | null;
        actualHours: number | null;
        completedAt: Date | null;
    }>;
    update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<{
        assignee: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        reporter: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        boardId: string;
        columnId: string;
        title: string;
        priority: string;
        taskNumber: string;
        dueDate: Date | null;
        startDate: Date | null;
        assigneeId: string | null;
        reporterId: string;
        position: number;
        estimatedHours: number | null;
        actualHours: number | null;
        completedAt: Date | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
