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
exports.RecordsController = void 0;
const common_1 = require("@nestjs/common");
const family_dto_1 = require("./dto/family.dto");
const identity_dto_1 = require("./dto/identity.dto");
const occupation_dto_1 = require("./dto/occupation.dto");
const personal_dto_1 = require("./dto/personal.dto");
const records_service_1 = require("./records.service");
let RecordsController = class RecordsController {
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    createStepOne(updateProfileDto) {
        return this.recordsService.createStepOne(updateProfileDto);
    }
    createStepTwo(updateIdentityDto, recordsId) {
        return this.recordsService.createStepTwo(updateIdentityDto, recordsId);
    }
    createStepThree(updateOccupationDto, recordsId) {
        return this.recordsService.createStepThree(updateOccupationDto, recordsId);
    }
    createStepFour(updateFamilyDto, recordsId) {
        return this.recordsService.createStepFour(updateFamilyDto, recordsId);
    }
    createStepFive(updatePolicyDto, recordsId) {
        return this.recordsService.createStepFive(updatePolicyDto, recordsId);
    }
    createStepSix(updateDocumentDto, recordsId) {
        return this.recordsService.createStepSix(updateDocumentDto, recordsId);
    }
    findAll(search, page = 1, limit = 10, sortBy = 'firstName', sortOrder = 'ASC') {
        return this.recordsService.findAll(search, Number(page), Number(limit), sortBy, sortOrder);
    }
    findOne(id) {
        return this.recordsService.findOne(+id);
    }
    remove(id) {
        return this.recordsService.remove(+id);
    }
    search(query) {
        return this.recordsService.searchRecords(query);
    }
};
exports.RecordsController = RecordsController;
__decorate([
    (0, common_1.Post)('step/one'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [personal_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "createStepOne", null);
__decorate([
    (0, common_1.Post)('step/two/:recordsId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('recordsId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [identity_dto_1.UpdateIdentityDto, Number]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "createStepTwo", null);
__decorate([
    (0, common_1.Post)('step/three/:recordsId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('recordsId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [occupation_dto_1.UpdateOccupationDto, Number]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "createStepThree", null);
__decorate([
    (0, common_1.Post)('step/four/:recordsId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('recordsId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [family_dto_1.UpdateFamilyDto, Number]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "createStepFour", null);
__decorate([
    (0, common_1.Post)('step/five/:recordsId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('recordsId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "createStepFive", null);
__decorate([
    (0, common_1.Post)('step/six/:recordsId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('recordsId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "createStepSix", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object, String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('elastic/search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "search", null);
exports.RecordsController = RecordsController = __decorate([
    (0, common_1.Controller)('records'),
    __metadata("design:paramtypes", [records_service_1.RecordsService])
], RecordsController);
//# sourceMappingURL=records.controller.js.map