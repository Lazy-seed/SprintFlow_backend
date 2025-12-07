import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
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
        title: string;
        description: string | null;
        priority: string;
        taskNumber: string;
        dueDate: Date | null;
        startDate: Date | null;
        position: number;
        estimatedHours: number | null;
        actualHours: number | null;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        boardId: string;
        columnId: string;
        assigneeId: string | null;
        reporterId: string;
    }>;
    findOne(id: string, userId: string): Promise<{
        comments: ({
            user: {
                id: string;
                email: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            taskId: string;
            content: string;
            mentions: import("@prisma/client/runtime/client").JsonValue;
        })[];
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
        subtasks: {
            id: string;
            title: string;
            position: number;
            createdAt: Date;
            completedAt: Date | null;
            parentTaskId: string;
            isCompleted: boolean;
        }[];
        _count: {
            comments: number;
            subtasks: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        priority: string;
        taskNumber: string;
        dueDate: Date | null;
        startDate: Date | null;
        position: number;
        estimatedHours: number | null;
        actualHours: number | null;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        boardId: string;
        columnId: string;
        assigneeId: string | null;
        reporterId: string;
    }>;
    update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<{
        comments: ({
            user: {
                id: string;
                email: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            taskId: string;
            content: string;
            mentions: import("@prisma/client/runtime/client").JsonValue;
        })[];
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
        subtasks: {
            id: string;
            title: string;
            position: number;
            createdAt: Date;
            completedAt: Date | null;
            parentTaskId: string;
            isCompleted: boolean;
        }[];
        _count: {
            comments: number;
            subtasks: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        priority: string;
        taskNumber: string;
        dueDate: Date | null;
        startDate: Date | null;
        position: number;
        estimatedHours: number | null;
        actualHours: number | null;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        boardId: string;
        columnId: string;
        assigneeId: string | null;
        reporterId: string;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
