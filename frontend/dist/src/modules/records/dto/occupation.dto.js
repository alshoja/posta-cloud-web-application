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
exports.UpdateOccupationDto = exports.AddressDto = exports.CreateOccupationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateOccupationDto {
}
exports.CreateOccupationDto = CreateOccupationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Redirection address must be a boolean.' }),
    __metadata("design:type", Boolean)
], CreateOccupationDto.prototype, "redirectionAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Is abroad must be a boolean.' }),
    __metadata("design:type", Boolean)
], CreateOccupationDto.prototype, "isAbroad", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Redirected house name must be a string.' }),
    __metadata("design:type", String)
], CreateOccupationDto.prototype, "redirectedHouseName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Redirected house number must be a string.' }),
    __metadata("design:type", String)
], CreateOccupationDto.prototype, "redirectedHouseNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Job must be a string.' }),
    __metadata("design:type", String)
], CreateOccupationDto.prototype, "job", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.retirementDate != ''),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Retirement date must be a valid date.' }),
    __metadata("design:type", String)
], CreateOccupationDto.prototype, "retirementDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Is redirected must be a boolean.' }),
    __metadata("design:type", Boolean)
], CreateOccupationDto.prototype, "isRedirected", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AddressDto),
    __metadata("design:type", Array)
], CreateOccupationDto.prototype, "addresses", void 0);
class AddressDto {
}
exports.AddressDto = AddressDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AddressDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'House name must be a string.' }),
    __metadata("design:type", String)
], AddressDto.prototype, "houseName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'House number must be a string.' }),
    __metadata("design:type", String)
], AddressDto.prototype, "houseNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Street name must be a string.' }),
    __metadata("design:type", String)
], AddressDto.prototype, "streetName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Street number must be a string.' }),
    __metadata("design:type", String)
], AddressDto.prototype, "streetNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Village must be a string.' }),
    __metadata("design:type", String)
], AddressDto.prototype, "village", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Post office must be a string.' }),
    __metadata("design:type", String)
], AddressDto.prototype, "postOffice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Location type must be a string.' }),
    __metadata("design:type", String)
], AddressDto.prototype, "locationType", void 0);
class UpdateOccupationDto extends (0, mapped_types_1.PartialType)(CreateOccupationDto) {
}
exports.UpdateOccupationDto = UpdateOccupationDto;
//# sourceMappingURL=occupation.dto.js.map