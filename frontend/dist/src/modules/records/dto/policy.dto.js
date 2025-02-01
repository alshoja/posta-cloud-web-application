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
exports.UpdatePolicyDto = exports.CreatePolicyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
class CreatePolicyDto {
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Policy type is required.' }),
    (0, class_validator_1.IsString)({ message: 'Policy type must be a string.' }),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Policy number is required.' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9]{8,12}$/, {
        message: 'Policy number must be 8-12 alphanumeric characters.',
    }),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "number", void 0);
class UpdatePolicyDto extends (0, mapped_types_1.PartialType)(CreatePolicyDto) {
}
exports.UpdatePolicyDto = UpdatePolicyDto;
//# sourceMappingURL=policy.dto.js.map