"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSizeValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let FileSizeValidationPipe = class FileSizeValidationPipe {
    constructor() {
        this.maxSize = 1000000;
        this.errors = [];
    }
    transform(value, metadata) {
        if (!value) {
            this.errors.push(`No file provided`);
        }
        if (Array.isArray(value)) {
            if (value.length === 0) {
                this.errors.push(`Some files are not provided in the array.`);
            }
            value.forEach((file) => this.validateFileSize(file, metadata));
        }
        else {
            this.validateFileSize(value, metadata);
        }
        return value;
    }
    validateFileSize(file, metadata) {
        if (this.errors.length > 0) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: this.errors,
                timestamp: new Date().toISOString(),
                path: metadata?.metatype?.name || 'Unknown path',
            });
        }
    }
};
exports.FileSizeValidationPipe = FileSizeValidationPipe;
exports.FileSizeValidationPipe = FileSizeValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileSizeValidationPipe);
//# sourceMappingURL=files-validation.pipe.js.map