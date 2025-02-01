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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordsService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("./entities/address.entity");
const child_entity_1 = require("./entities/child.entity");
const document_entity_1 = require("./entities/document.entity");
const policy_entity_1 = require("./entities/policy.entity");
const record_entity_1 = require("./entities/record.entity");
const elasticsearch_service_1 = require("../../shared/elastic-search/elasticsearch.service");
let RecordsService = class RecordsService {
    constructor(request, recordRepository, dataSource, esService) {
        this.request = request;
        this.recordRepository = recordRepository;
        this.dataSource = dataSource;
        this.esService = esService;
        this.elasticIndex = 'records;';
    }
    async createStepOne(updateProfileDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let recordId;
            const recordRepository = queryRunner.manager.getRepository(record_entity_1.Record);
            const existingRecord = await recordRepository.findOne({
                where: { id: updateProfileDto.id },
            });
            if (existingRecord) {
                await recordRepository.update({ id: updateProfileDto.id }, updateProfileDto);
                recordId = existingRecord.id;
            }
            else {
                updateProfileDto.userId = this.request.user.sub;
                const newRecord = await recordRepository.insert(updateProfileDto);
                recordId = newRecord.identifiers[0].id;
                const _existingRecord = await recordRepository.findOne({
                    where: { id: recordId },
                });
                await this.esService.indexRecord({
                    id: recordId,
                    email: _existingRecord.email,
                    mobile: _existingRecord.mobileNumber,
                    firstName: _existingRecord.firstName,
                }, this.elasticIndex);
            }
            await queryRunner.commitTransaction();
            return {
                id: recordId,
            };
        }
        catch (err) {
            console.log('Rolling Back ', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createStepTwo(updateIdentityDto, recordsId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.findOne(recordsId);
            const recordRepository = queryRunner.manager.getRepository(record_entity_1.Record);
            const newRecord = this.recordRepository.create(updateIdentityDto);
            await recordRepository.update({ id: recordsId }, newRecord);
            await queryRunner.commitTransaction();
            return {
                id: recordsId,
            };
        }
        catch (err) {
            console.log('Rolling Back ', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createStepThree({ addresses, ...updateOccupationDto }, recordsId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.findOne(recordsId);
            const _addresses = addresses.map((address) => ({
                ...address,
                recordsId,
            }));
            const recordRepository = queryRunner.manager.getRepository(record_entity_1.Record);
            const addressRepository = queryRunner.manager.getRepository(address_entity_1.Address);
            const createdRecord = recordRepository.create({
                ...updateOccupationDto,
            });
            await addressRepository.delete({ recordsId });
            await addressRepository.insert(_addresses);
            await recordRepository.update({ id: recordsId }, createdRecord);
            await queryRunner.commitTransaction();
            return {
                id: recordsId,
            };
        }
        catch (err) {
            console.log('Rolling Back ', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createStepFour({ children, ...updateFamilyDto }, recordsId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.findOne(recordsId);
            const _children = children.map((child) => ({
                ...child,
                recordsId,
            }));
            const recordRepository = queryRunner.manager.getRepository(record_entity_1.Record);
            const childRepository = queryRunner.manager.getRepository(child_entity_1.Child);
            await childRepository.delete({ recordsId });
            await childRepository.insert(_children);
            const createdRecord = recordRepository.create({
                ...updateFamilyDto,
            });
            await recordRepository.update({ id: recordsId }, createdRecord);
            await queryRunner.commitTransaction();
            return {
                id: recordsId,
            };
        }
        catch (err) {
            console.log('Rolling Back ', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createStepFive(updatePolicyDto, recordsId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.findOne(recordsId);
            const policies = updatePolicyDto.map((policy) => ({
                ...policy,
                recordsId,
            }));
            const policyRepository = queryRunner.manager.getRepository(policy_entity_1.Policy);
            await policyRepository.delete({ recordsId });
            await policyRepository.insert(policies);
            await queryRunner.commitTransaction();
            return {
                id: recordsId,
            };
        }
        catch (err) {
            console.log('Rolling Back ', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createStepSix(documentDto, recordsId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.findOne(recordsId);
            const _document = documentDto.map((document) => ({
                ...document,
                recordsId,
            }));
            const documentRepository = queryRunner.manager.getRepository(document_entity_1.Document);
            await documentRepository.delete({ recordsId });
            await documentRepository.insert(_document);
            await queryRunner.commitTransaction();
            return {
                id: recordsId,
            };
        }
        catch (err) {
            console.log('Rolling Back ', err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(search, page, limit, sortBy, sortOrder) {
        try {
            const userId = this.request.user.sub;
            const [data, total] = await this.recordRepository.findAndCount({
                relations: ['addresses', 'children', 'policies', 'documents'],
                where: search
                    ? [
                        {
                            userId,
                            firstName: (0, typeorm_2.ILike)(`%${search}%`),
                        },
                        {
                            userId,
                            lastName: (0, typeorm_2.ILike)(`%${search}%`),
                        },
                        {
                            userId,
                            email: (0, typeorm_2.ILike)(`%${search}%`),
                        },
                        {
                            userId,
                            mobileNumber: (0, typeorm_2.ILike)(`%${search}%`),
                        },
                    ]
                    : {
                        userId,
                    },
                order: { [sortBy]: sortOrder.toUpperCase() },
                skip: (page - 1) * limit,
                take: limit,
            });
            return { data, total };
        }
        catch (err) {
            console.error('Error finding records:', err);
            throw new common_1.InternalServerErrorException('Error finding records');
        }
    }
    async findOne(id) {
        const userId = this.request.user.sub;
        const record = await this.recordRepository.findOne({
            relations: ['addresses', 'children', 'policies', 'documents'],
            where: { id, userId },
        });
        if (!record) {
            throw new common_1.NotFoundException(`Record with ID ${id} not found`);
        }
        return record;
    }
    async findOneByEmail(email) {
        try {
            const record = await this.recordRepository.findOne({ where: { email } });
            if (!record) {
                throw new common_1.NotFoundException(`Record with email ${email} not found`);
            }
            return record;
        }
        catch (err) {
            console.error('Error finding record by email:', err);
            throw new common_1.InternalServerErrorException('Error finding record by email');
        }
    }
    async remove(id) {
        const userId = this.request.user.sub;
        try {
            const result = await this.recordRepository.delete({ id, userId });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Record with ID ${id} not found`);
            }
            await this.esService.deleteDocumentById(String(id), this.elasticIndex);
        }
        catch (err) {
            console.error('Error removing record:', err);
            throw new common_1.InternalServerErrorException('Error removing record');
        }
    }
    async searchRecords(query) {
        return this.esService.searchRecords(query, this.elasticIndex);
    }
};
exports.RecordsService = RecordsService;
exports.RecordsService = RecordsService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(record_entity_1.Record)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.DataSource, typeof (_a = typeof elasticsearch_service_1.ElasticsearchService !== "undefined" && elasticsearch_service_1.ElasticsearchService) === "function" ? _a : Object])
], RecordsService);
//# sourceMappingURL=records.service.js.map