import { IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    columnId: string;

    @IsEnum(['low', 'medium', 'high', 'critical'])
    @IsOptional()
    priority?: string;

    @IsString()
    @IsOptional()
    assigneeId?: string;
}
