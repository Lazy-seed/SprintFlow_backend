import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() createWorkspaceDto: CreateWorkspaceDto) {
        return this.workspaceService.create(user.id, createWorkspaceDto);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.workspaceService.findAllByUser(user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.workspaceService.findOne(id, user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.workspaceService.remove(id, user.id);
    }
}
