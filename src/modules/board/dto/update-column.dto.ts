/**
 * UpdateColumnDto - Data Transfer Object for updating an existing column
 * 
 * WHAT IS PartialType?
 * - PartialType is a utility from NestJS that makes all fields optional
 * - It takes CreateColumnDto and creates a new type where:
 *   - All fields become optional (name?, color?)
 *   - All validation rules are preserved
 * 
 * WHY USE IT?
 * - When updating, users might only want to change the name OR the color
 * - We don't want to force them to send both fields
 * - This keeps our code DRY (Don't Repeat Yourself)
 * 
 * EXAMPLE USAGE:
 * - Update only name: { name: "New Name" }
 * - Update only color: { color: "#ff0000" }
 * - Update both: { name: "New Name", color: "#ff0000" }
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';

/**
 * This extends CreateColumnDto but makes all fields optional
 * So instead of:
 *   name: string (required)
 *   color?: string (optional)
 * 
 * We get:
 *   name?: string (optional)
 *   color?: string (optional)
 */
export class UpdateColumnDto extends PartialType(CreateColumnDto) { }
