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
exports.UpdateIdentityDto = exports.CreateIdentityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
class CreateIdentityDto {
}
exports.CreateIdentityDto = CreateIdentityDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.aadhaarNumber != ''),
    (0, class_validator_1.Matches)(/^\d{12}$/, {
        message: 'Aadhaar number must be 12 digits.',
    }),
    __metadata("design:type", String)
], CreateIdentityDto.prototype, "aadhaarNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(15, { message: 'Driving License must be 15 characters.' }),
    (0, class_validator_1.ValidateIf)((o) => o.drivingLicense != ''),
    __metadata("design:type", String)
], CreateIdentityDto.prototype, "drivingLicense", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.electionID != ''),
    (0, class_validator_1.IsString)({ message: 'Election ID must be a string.' }),
    (0, class_validator_1.MinLength)(10, { message: 'Election ID must be 10 characters' }),
    __metadata("design:type", String)
], CreateIdentityDto.prototype, "electionID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.passportNumber != ''),
    (0, class_validator_1.MinLength)(8, { message: 'Passport number must be 8 characters.' }),
    __metadata("design:type", String)
], CreateIdentityDto.prototype, "passportNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIdentityDto.prototype, "postBoxNumber", void 0);
class UpdateIdentityDto extends (0, mapped_types_1.PartialType)(CreateIdentityDto) {
}
exports.UpdateIdentityDto = UpdateIdentityDto;
//# sourceMappingURL=identity.dto.js.map