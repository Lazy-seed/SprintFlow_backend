/**
 * CreateColumnDto - Data Transfer Object for creating a new board column
 * 
 * WHAT IS A DTO?
 * - DTO stands for Data Transfer Object
 * - It defines the shape of data that the API expects to receive
 * - It provides validation rules to ensure data is correct before processing
 * - It gives TypeScript type safety throughout the application
 * 
 * HOW IT WORKS:
 * 1. Client sends JSON data in request body
 * 2. NestJS automatically validates it against this DTO
 * 3. If validation fails, NestJS returns 400 Bad Request
 * 4. If validation passes, the data is passed to the service
 */

import { IsString, IsOptional, IsHexColor, MinLength, MaxLength } from 'class-validator';

export class CreateColumnDto {
    /**
     * Column name - REQUIRED
     * 
     * @IsString() - Ensures the value is a string type
     * @MinLength(1) - Name must be at least 1 character
     * @MaxLength(50) - Name can't exceed 50 characters
     * 
     * Example: "In Review", "Testing", "Deployed"
     */
    @IsString()
    @MinLength(1, { message: 'Column name must not be empty' })
    @MaxLength(50, { message: 'Column name must not exceed 50 characters' })
    name: string;

    /**
     * Column color - OPTIONAL
     * 
     * @IsOptional() - This field is not required
     * @IsHexColor() - If provided, must be a valid hex color (e.g., #FF5733)
     * 
     * Default: If not provided, will use gray (#6b7280) in the service
     * Example: "#3b82f6" (blue), "#ef4444" (red), "#10b981" (green)
     */
    @IsOptional()
    @IsHexColor()
    color?: string;
}
