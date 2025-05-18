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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFamilyDto = exports.ChildDto = exports.CreateFamilyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const gender_enum_1 = require("../enums/gender.enum");
class CreateFamilyDto {
}
exports.CreateFamilyDto = CreateFamilyDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.marriageDate != ''),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Marriage date must be a valid date.' }),
    __metadata("design:type", String)
], CreateFamilyDto.prototype, "marriageDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Previous address must be a string.' }),
    __metadata("design:type", String)
], CreateFamilyDto.prototype, "previousAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChildDto),
    __metadata("design:type", Array)
], CreateFamilyDto.prototype, "children", void 0);
class ChildDto {
}
exports.ChildDto = ChildDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Child name is required.' }),
    (0, class_validator_1.IsString)({ message: 'Child name must be a string.' }),
    __metadata("design:type", String)
], ChildDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of birth is required.' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Date of birth must be a valid date.' }),
    __metadata("design:type", String)
], ChildDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Gender is required.' }),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender, {
        message: 'Gender must be Male, Female, or Other.',
    }),
    __metadata("design:type", String)
], ChildDto.prototype, "gender", void 0);
class UpdateFamilyDto extends (0, mapped_types_1.PartialType)(CreateFamilyDto) {
}
exports.UpdateFamilyDto = UpdateFamilyDto;
//# sourceMappingURL=family.dto.js.map