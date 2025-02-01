import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Record } from '../../modules/records/entities/record.entity';
import { Gender } from '../../modules/records/enums/gender.enum';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async seedRecords(numRecords: number): Promise<void> {
    const records: Record[] = [];

    for (let i = 0; i < numRecords; i++) {
      const record = this.recordRepository.create({
        profileImage: `-User${i + 1}.jpg`,
        postBoxNumber: i + 1,
        email: `user${i + 1}@gmail.com`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        mobileNumber: faker.string.numeric(10),
        whatsappNumber: faker.phone.number({
          style: 'international',
        }),
        dateOfBirth: faker.date
          .birthdate({ min: 1970, max: 2000, mode: 'year' })
          .toISOString()
          .split('T')[0],
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        houseName: faker.location.secondaryAddress(),
        houseNumber: faker.string.numeric(2),
        streetName: faker.location.street(),
        streetNumber: faker.string.numeric(3),
        panchayat: faker.location.city(),
        district: faker.location.state(),
        aadhaarNumber: faker.string.numeric(16),
        job: faker.helpers.arrayElement(['Engineer', 'Doctor', 'Teacher']),
        postOffice: parseInt(faker.string.numeric(6)),
        village: faker.location.city(),
        previousAddress: faker.location.streetAddress(),
      });

      records.push(record);
    }

    await this.recordRepository.save(records);
    console.log(`${numRecords} records inserted successfully!`);
  }
}
