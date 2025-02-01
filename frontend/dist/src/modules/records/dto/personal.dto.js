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
exports.UpdateProfileDto = exports.CreateProfileDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const exist_rule_validator_1 = require("../../../shared/validators/exist-rule.validator");
const gender_enum_1 = require("../enums/gender.enum");
class CreateProfileDto {
}
exports.CreateProfileDto = CreateProfileDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.id != ''),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProfileDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "profileImage", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'First name is required.' }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Last name is required.' }),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail must be valid.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required.' }),
    (0, class_validator_1.Validate)(exist_rule_validator_1.ExistsRule, ['records:email:id']),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Gender is required.' }),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender, {
        message: 'Gender must be Male, Female, or Other.',
    }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'House name is required.' }),
    (0, class_validator_1.IsString)({ message: 'House name must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "houseName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'House number must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "houseNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Street name is required.' }),
    (0, class_validator_1.IsString)({ message: 'Street name must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "streetName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Street number  is required.' }),
    (0, class_validator_1.IsString)({ message: 'Street number must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "streetNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Post office is required.' }),
    (0, class_validator_1.Min)(100000, { message: 'PostOffice Number must be 6 digit ' }),
    (0, class_validator_1.Max)(999999, { message: 'PostOffice Number must be 6 digit ' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProfileDto.prototype, "postOffice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Panchayath is required.' }),
    (0, class_validator_1.IsString)({ message: 'Panchayath must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "panchayat", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'District is required.' }),
    (0, class_validator_1.IsString)({ message: 'District must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mobile number is required.' }),
    (0, class_validator_1.Validate)(exist_rule_validator_1.ExistsRule, ['records:mobileNumber:id']),
    (0, class_validator_1.Matches)(/^\d{10}$/, { message: 'Mobile number must be 10 digits.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.whatsappNumber != ''),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Village must be a string.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "village", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of Birth is required.' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Date of birth must be a valid date.' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.userId != null),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProfileDto.prototype, "userId", void 0);
class UpdateProfileDto extends (0, mapped_types_1.PartialType)(CreateProfileDto) {
}
exports.UpdateProfileDto = UpdateProfileDto;
//# sourceMappingURL=personal.dto.js.map