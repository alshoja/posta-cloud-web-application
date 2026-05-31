import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Record } from '../../modules/records/entities/record.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Gender } from '../../modules/records/enums/gender.enum';

@Injectable()
export class SeederService {
  private readonly seedPassword = 'Admin@123456';
  private readonly seedUserCount = 10;
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedRecords(numRecords: number): Promise<void> {
    const isDevelopment = this.configService.get<boolean>(
      'config.isDevelopment',
    );
    if (!isDevelopment) {
      this.logger.warn('Skipping seed: seeding is only allowed in development');
      return;
    }

    const seedUsers = await this.getOrCreateSeedUsers();
    this.logger.log(`Seed users available: ${seedUsers.length}`);

    const existingRecordCount = await this.recordRepository.count();
    if (existingRecordCount > 0) {
      this.logger.debug(
        `Skipping seed: ${existingRecordCount} records already exist`,
      );
      return;
    }

    try {
      const records: Record[] = [];

      for (let i = 0; i < numRecords; i++) {
        const seedUser = seedUsers[i % seedUsers.length];
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown seeding error';
      const stack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to seed records: ${message}`,
        stack,
      );
      throw error;
    }
  }

  private async getOrCreateSeedUsers(): Promise<User[]> {
    const seedUsernames = Array.from(
      { length: this.seedUserCount },
      (_, index) => `admin${index + 1}@example.com`,
    );
    const existingUsers = await this.userRepository.find({
      where: { username: In(seedUsernames) },
    });
    const existingUsersByUsername = new Map(
      existingUsers.map((user) => [user.username, user]),
    );
    const seedUsers: User[] = [];

    for (const username of seedUsernames) {
      const existingUser = existingUsersByUsername.get(username);

      if (existingUser) {
        this.logger.log(`Using existing seed user: ${username}`);
        seedUsers.push(existingUser);
        continue;
      }

      const seedUser = this.userRepository.create({
        username,
        password: this.seedPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        isActive: true,
      });

      const savedSeedUser = await this.userRepository.save(seedUser);
      this.logger.log(`Created new seed user: ${username}`);
      seedUsers.push(savedSeedUser);
    }

    return seedUsers;
  }
}
