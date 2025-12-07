import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(boardId: string, user: any, createTaskDto: CreateTaskDto): Promise<{
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
    update(id: string, user: any, updateTaskDto: UpdateTaskDto): Promise<{
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
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
