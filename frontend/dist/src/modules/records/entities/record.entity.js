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
exports.Record = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const gender_enum_1 = require("../enums/gender.enum");
const address_entity_1 = require("./address.entity");
const child_entity_1 = require("./child.entity");
const document_entity_1 = require("./document.entity");
const policy_entity_1 = require("./policy.entity");
const encryption_utility_1 = require("../../../utilities/encryption.utility");
const user_entity_1 = require("../../users/entities/user.entity");
let Record = class Record {
    async encryptSensitiveInformation() {
        if (this.aadhaarNumber && !this.aadhaarNumber.startsWith('iv:')) {
            this.aadhaarNumber = encryption_utility_1.EncryptionUtility.encrypt(this.aadhaarNumber);
        }
        if (this.electionID && !this.electionID.startsWith('iv:')) {
            this.electionID = encryption_utility_1.EncryptionUtility.encrypt(this.electionID);
        }
        if (this.passportNumber && !this.passportNumber.startsWith('iv:')) {
            this.passportNumber = encryption_utility_1.EncryptionUtility.encrypt(this.passportNumber);
        }
        if (this.drivingLicense && !this.drivingLicense.startsWith('iv:')) {
            this.drivingLicense = encryption_utility_1.EncryptionUtility.encrypt(this.drivingLicense);
        }
    }
};
exports.Record = Record;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Record.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "profileImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Record.prototype, "postBoxNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Record.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Record.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Record.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Record.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "whatsappNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: gender_enum_1.Gender,
        default: gender_enum_1.Gender.OTHER,
    }),
    __metadata("design:type", String)
], Record.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "houseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "houseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "streetName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "streetNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "panchayat", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? encryption_utility_1.EncryptionUtility.decrypt(value) : value), {
        toPlainOnly: true,
    }),
    __metadata("design:type", String)
], Record.prototype, "aadhaarNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? encryption_utility_1.EncryptionUtility.decrypt(value) : value), {
        toPlainOnly: true,
    }),
    __metadata("design:type", String)
], Record.prototype, "drivingLicense", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? encryption_utility_1.EncryptionUtility.decrypt(value) : value), {
        toPlainOnly: true,
    }),
    __metadata("design:type", String)
], Record.prototype, "electionID", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? encryption_utility_1.EncryptionUtility.decrypt(value) : value), {
        toPlainOnly: true,
    }),
    __metadata("design:type", String)
], Record.prototype, "passportNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Record.prototype, "redirectionAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Record.prototype, "isAbroad", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "redirectedHouseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "redirectedHouseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "retirementDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Record.prototype, "isRedirected", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Record.prototype, "postOffice", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, (address) => address.records, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Record.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "marriageDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "village", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Record.prototype, "previousAddress", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => child_entity_1.Child, (child) => child.records, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Record.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (document) => document.records, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Record.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => policy_entity_1.Policy, (policy) => policy.records, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Record.prototype, "policies", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.records, {
        onDelete: 'CASCADE',
        nullable: false,
    }),
    __metadata("design:type", user_entity_1.User)
], Record.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Record.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Record.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Record.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Record.prototype, "encryptSensitiveInformation", null);
exports.Record = Record = __decorate([
    (0, typeorm_1.Entity)('records')
], Record);
//# sourceMappingURL=record.entity.js.map