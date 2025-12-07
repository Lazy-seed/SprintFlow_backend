import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    columnId?: string;

    @IsEnum(['low', 'medium', 'high', 'critical'])
    @IsOptional()
    priority?: string;

    @IsString()
    @IsOptional()
    assigneeId?: string;

    @IsOptional()
    position?: number;
}
