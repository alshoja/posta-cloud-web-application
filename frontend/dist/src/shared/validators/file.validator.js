"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateFile = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let ValidateFile = class ValidateFile {
    validate(value, args) {
        const { constraints } = args;
        const [maxSize, allowedTypes] = constraints;
        console.log('🚀 ~ VAlue in  ~ file:', value);
        if (Array.isArray(value)) {
            return value.every((file) => this.validateFile(file, maxSize, allowedTypes));
        }
        return this.validateFile(value, maxSize, allowedTypes);
    }
    validateFile(file, maxSize, allowedTypes) {
        console.log('🚀 ~ ValidateFile ~ file:', file);
        if (!file) {
            throw new common_1.BadRequestException('No file provided.');
        }
        if (file.size > maxSize) {
            console.log('🚀 ~ ValidateFile ~ maxSize:', maxSize);
            throw new common_1.BadRequestException(`File size exceeds the limit of ${maxSize} bytes.`);
        }
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`File type ${file.mimetype} is not allowed.`);
        }
        return true;
    }
    defaultMessage(args) {
        const [maxSize, allowedTypes] = args.constraints;
        console.log('🚀 ~ ValidateFile ~ defaultMessage ~ maxSize:', maxSize);
        return `File(s) must not exceed ${maxSize} bytes and must be of type: ${allowedTypes.join(', ')}.`;
    }
};
exports.ValidateFile = ValidateFile;
exports.ValidateFile = ValidateFile = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ValidateFile', async: false }),
    (0, common_1.Injectable)()
], ValidateFile);
//# sourceMappingURL=file.validator.js.map