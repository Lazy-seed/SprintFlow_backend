import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubtaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;
}
