import { SubtaskService } from './subtask.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
export declare class SubtaskController {
    private readonly subtaskService;
    constructor(subtaskService: SubtaskService);
    create(taskId: string, userId: string, createSubtaskDto: CreateSubtaskDto): Promise<{
        id: string;
        title: string;
        isCompleted: boolean;
        position: number;
        createdAt: Date;
        completedAt: Date | null;
        parentTaskId: string;
    }>;
    findAll(taskId: string, userId: string): Promise<{
        id: string;
        title: string;
        isCompleted: boolean;
        position: number;
        createdAt: Date;
        completedAt: Date | null;
        parentTaskId: string;
    }[]>;
    update(id: string, userId: string, updateSubtaskDto: UpdateSubtaskDto): Promise<{
        id: string;
        title: string;
        isCompleted: boolean;
        position: number;
        createdAt: Date;
        completedAt: Date | null;
        parentTaskId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        title: string;
        isCompleted: boolean;
        position: number;
        createdAt: Date;
        completedAt: Date | null;
        parentTaskId: string;
    }>;
}
