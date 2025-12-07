/**
 * ReorderColumnsDto - Data Transfer Object for reordering columns
 * 
 * PURPOSE:
 * When users drag columns to reorder them, we need to save the new order.
 * This DTO receives an array of column IDs in their new order.
 * 
 * EXAMPLE:
 * Before: [col1, col2, col3]
 * User drags col3 to first position
 * After: [col3, col1, col2]
 * 
 * We send: { columnIds: ["col3-uuid", "col1-uuid", "col2-uuid"] }
 * The service will update positions: col3=0, col1=1, col2=2
 */

import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class ReorderColumnsDto {
    /**
     * Array of column IDs in their new order
     * 
     * @IsArray() - Must be an array
     * @ArrayMinSize(1) - Must have at least 1 column
     * @IsUUID('4', { each: true }) - Each item must be a valid UUID v4
     * 
     * The { each: true } option means:
     * - Validate EACH item in the array
     * - Not just the array itself
     * 
     * Example: ["uuid1", "uuid2", "uuid3"]
     */
    @IsArray()
    @ArrayMinSize(1, { message: 'Must provide at least one column ID' })
    @IsUUID('4', { each: true, message: 'Each column ID must be a valid UUID' })
    columnIds: string[];
}
