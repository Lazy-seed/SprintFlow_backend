import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateBoardDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean;

    @IsInt()
    @IsOptional()
    position?: number;
}
