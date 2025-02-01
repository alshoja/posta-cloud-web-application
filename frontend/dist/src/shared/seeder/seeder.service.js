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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const record_entity_1 = require("../../modules/records/entities/record.entity");
const gender_enum_1 = require("../../modules/records/enums/gender.enum");
let SeederService = class SeederService {
    constructor(recordRepository) {
        this.recordRepository = recordRepository;
    }
    async seedRecords(numRecords) {
        const records = [];
        for (let i = 0; i < numRecords; i++) {
            const record = this.recordRepository.create({
                profileImage: `-User${i + 1}.jpg`,
                postBoxNumber: i + 1,
                email: `user${i + 1}@gmail.com`,
                firstName: faker_1.faker.person.firstName(),
                lastName: faker_1.faker.person.lastName(),
                mobileNumber: faker_1.faker.string.numeric(10),
                whatsappNumber: faker_1.faker.phone.number({
                    style: 'international',
                }),
                dateOfBirth: faker_1.faker.date
                    .birthdate({ min: 1970, max: 2000, mode: 'year' })
                    .toISOString()
                    .split('T')[0],
                gender: faker_1.faker.helpers.arrayElement(Object.values(gender_enum_1.Gender)),
                houseName: faker_1.faker.location.secondaryAddress(),
                houseNumber: faker_1.faker.string.numeric(2),
                streetName: faker_1.faker.location.street(),
                streetNumber: faker_1.faker.string.numeric(3),
                panchayat: faker_1.faker.location.city(),
                district: faker_1.faker.location.state(),
                aadhaarNumber: faker_1.faker.string.numeric(16),
                job: faker_1.faker.helpers.arrayElement(['Engineer', 'Doctor', 'Teacher']),
                postOffice: parseInt(faker_1.faker.string.numeric(6)),
                village: faker_1.faker.location.city(),
                previousAddress: faker_1.faker.location.streetAddress(),
            });
            records.push(record);
        }
        await this.recordRepository.save(records);
        console.log(`${numRecords} records inserted successfully!`);
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(record_entity_1.Record)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeederService);
//# sourceMappingURL=seeder.service.js.map