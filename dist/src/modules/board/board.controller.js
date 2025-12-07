"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const common_1 = require("@nestjs/common");
const board_service_1 = require("./board.service");
const create_board_dto_1 = require("./dto/create-board.dto");
const create_column_dto_1 = require("./dto/create-column.dto");
const update_column_dto_1 = require("./dto/update-column.dto");
const reorder_columns_dto_1 = require("./dto/reorder-columns.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let BoardController = class BoardController {
    boardService;
    constructor(boardService) {
        this.boardService = boardService;
    }
    create(workspaceId, user, createBoardDto) {
        return this.boardService.create(workspaceId, user.id, createBoardDto);
    }
    findAll(workspaceId, user) {
        return this.boardService.findAllByWorkspace(workspaceId, user.id);
    }
    findOne(id, user) {
        return this.boardService.findOne(id, user.id);
    }
    remove(id, user) {
        return this.boardService.remove(id, user.id);
    }
    createColumn(boardId, user, createColumnDto) {
        return this.boardService.createColumn(boardId, user.id, createColumnDto);
    }
    updateColumn(columnId, user, updateColumnDto) {
        return this.boardService.updateColumn(columnId, user.id, updateColumnDto);
    }
    deleteColumn(columnId, user, targetColumnId) {
        return this.boardService.deleteColumn(columnId, user.id, targetColumnId);
    }
    reorderColumns(boardId, user, reorderColumnsDto) {
        return this.boardService.reorderColumns(boardId, user.id, reorderColumnsDto);
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_board_dto_1.CreateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/columns'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_column_dto_1.CreateColumnDto]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "createColumn", null);
__decorate([
    (0, common_1.Patch)(':id/columns/:columnId'),
    __param(0, (0, common_1.Param)('columnId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_column_dto_1.UpdateColumnDto]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "updateColumn", null);
__decorate([
    (0, common_1.Delete)(':id/columns/:columnId'),
    __param(0, (0, common_1.Param)('columnId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('targetColumnId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "deleteColumn", null);
__decorate([
    (0, common_1.Patch)(':id/columns/reorder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, reorder_columns_dto_1.ReorderColumnsDto]),
    __metadata("design:returntype", void 0)
], BoardController.prototype, "reorderColumns", null);
exports.BoardController = BoardController = __decorate([
    (0, common_1.Controller)('workspaces/:workspaceId/boards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [board_service_1.BoardService])
], BoardController);
//# sourceMappingURL=board.controller.js.map