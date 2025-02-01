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
exports.Child = void 0;
const typeorm_1 = require("typeorm");
const record_entity_1 = require("./record.entity");
const gender_enum_1 = require("../enums/gender.enum");
let Child = class Child {
};
exports.Child = Child;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Child.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Child.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Child.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: gender_enum_1.Gender,
        default: gender_enum_1.Gender.OTHER,
    }),
    __metadata("design:type", String)
], Child.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => record_entity_1.Record, (records) => records.children, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'recordsId' }),
    __metadata("design:type", record_entity_1.Record)
], Child.prototype, "records", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Child.prototype, "recordsId", void 0);
exports.Child = Child = __decorate([
    (0, typeorm_1.Entity)('children')
], Child);
//# sourceMappingURL=child.entity.js.map