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
exports.SubtaskController = void 0;
const common_1 = require("@nestjs/common");
const subtask_service_1 = require("./subtask.service");
const create_subtask_dto_1 = require("./dto/create-subtask.dto");
const update_subtask_dto_1 = require("./dto/update-subtask.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let SubtaskController = class SubtaskController {
    subtaskService;
    constructor(subtaskService) {
        this.subtaskService = subtaskService;
    }
    create(taskId, userId, createSubtaskDto) {
        return this.subtaskService.create(taskId, userId, createSubtaskDto);
    }
    findAll(taskId, userId) {
        return this.subtaskService.findAll(taskId, userId);
    }
    update(id, userId, updateSubtaskDto) {
        return this.subtaskService.update(id, userId, updateSubtaskDto);
    }
    remove(id, userId) {
        return this.subtaskService.remove(id, userId);
    }
};
exports.SubtaskController = SubtaskController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_subtask_dto_1.CreateSubtaskDto]),
    __metadata("design:returntype", void 0)
], SubtaskController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SubtaskController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_subtask_dto_1.UpdateSubtaskDto]),
    __metadata("design:returntype", void 0)
], SubtaskController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SubtaskController.prototype, "remove", null);
exports.SubtaskController = SubtaskController = __decorate([
    (0, common_1.Controller)('tasks/:taskId/subtasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [subtask_service_1.SubtaskService])
], SubtaskController);
//# sourceMappingURL=subtask.controller.js.map