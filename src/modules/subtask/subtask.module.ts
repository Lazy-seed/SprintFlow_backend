import { Module } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { SubtaskController } from './subtask.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [SubtaskController],
    providers: [SubtaskService],
})
export class SubtaskModule { }
