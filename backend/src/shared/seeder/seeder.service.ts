import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Record } from '../../modules/records/entities/record.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Gender } from '../../modules/records/enums/gender.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedRecords(numRecords: number): Promise<void> {
    // Check if records already exist to avoid duplicates
    const existingRecordCount = await this.recordRepository.count();
    if (existingRecordCount > 0) {
      this.logger.debug(
        `Skipping seed: ${existingRecordCount} records already exist`,
      );
      return;
    }

    try {
      // Get or create a default seed user
      const seedUser = await this.getOrCreateSeedUser();
      this.logger.log(`Using seed user ID: ${seedUser.id}`);

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
          userId: seedUser.id,
          user: seedUser,
        });

        records.push(record);
      }

      await this.recordRepository.save(records);
      this.logger.log(`${numRecords} records inserted successfully!`);
    } catch (error) {
      this.logger.error(
        `Failed to seed records: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async getOrCreateSeedUser(): Promise<User> {
    const seedUsername = this.configService.get<string>('config.seedUserName');
    const seedPassword = this.configService.get<string>(
      'config.seedUserPassword',
    );

    let seedUser = await this.userRepository.findOne({
      where: { username: seedUsername },
    });

    if (!seedUser) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(seedPassword, salt);

      seedUser = this.userRepository.create({
        username: seedUsername,
        password: hashedPassword,
        firstName: 'Seed',
        lastName: 'Admin',
        isActive: true,
      });

      seedUser = await this.userRepository.save(seedUser);
      this.logger.log(`Created new seed user: ${seedUsername}`);
    } else {
      this.logger.log(`Using existing seed user: ${seedUsername}`);
    }

    return seedUser;
  }
}
