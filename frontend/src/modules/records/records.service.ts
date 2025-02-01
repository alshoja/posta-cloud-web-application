import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/types/express';
import { DocumentDto } from './dto/document.dto';
import { UpdateFamilyDto } from './dto/family.dto';
import { UpdateIdentityDto } from './dto/identity.dto';
import { UpdateOccupationDto } from './dto/occupation.dto';
import { UpdateProfileDto } from './dto/personal.dto';
import { UpdatePolicyDto } from './dto/policy.dto';
import { Address } from './entities/address.entity';
import { Child } from './entities/child.entity';
import { Document } from './entities/document.entity';
import { Policy } from './entities/policy.entity';
import { Record } from './entities/record.entity';
import { ElasticsearchService } from '../../shared/elastic-search/elasticsearch.service';

@Injectable({ scope: Scope.REQUEST })
export class RecordsService {
  private readonly elasticIndex = 'records;';
  constructor(
    @Inject(REQUEST)
    private request: AuthenticatedRequest,
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    private dataSource: DataSource,
    private esService: ElasticsearchService,
  ) {}

  async createStepOne(
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let recordId: number;
      const recordRepository = queryRunner.manager.getRepository(Record);

      const existingRecord = await recordRepository.findOne({
        where: { id: updateProfileDto.id },
      });

      if (existingRecord) {
        await recordRepository.update(
          { id: updateProfileDto.id },
          updateProfileDto,
        );
        recordId = existingRecord.id;
      } else {
        updateProfileDto.userId = this.request.user.sub;
        const newRecord = await recordRepository.insert(updateProfileDto);

        recordId = newRecord.identifiers[0].id;
        const _existingRecord = await recordRepository.findOne({
          where: { id: recordId },
        });

        await this.esService.indexRecord(
          {
            id: recordId,
            email: _existingRecord.email,
            mobile: _existingRecord.mobileNumber,
            firstName: _existingRecord.firstName,
          },
          this.elasticIndex,
        );
      }
      await queryRunner.commitTransaction();
      return {
        id: recordId,
      };
    } catch (err) {
      console.log('Rolling Back ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createStepTwo(
    updateIdentityDto: UpdateIdentityDto,
    recordsId: number,
  ): Promise<{ id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.findOne(recordsId);
      const recordRepository = queryRunner.manager.getRepository(Record);
      const newRecord = this.recordRepository.create(updateIdentityDto);
      await recordRepository.update({ id: recordsId }, newRecord);
      await queryRunner.commitTransaction();
      return {
        id: recordsId,
      };
    } catch (err) {
      console.log('Rolling Back ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async createStepThree(
    { addresses, ...updateOccupationDto }: UpdateOccupationDto,
    recordsId: number,
  ): Promise<{ id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.findOne(recordsId);
      const _addresses = addresses.map((address) => ({
        ...address,
        recordsId,
      }));

      const recordRepository = queryRunner.manager.getRepository(Record);
      const addressRepository = queryRunner.manager.getRepository(Address);

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
    } catch (err) {
      console.log('Rolling Back ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createStepFour(
    { children, ...updateFamilyDto }: UpdateFamilyDto,
    recordsId: number,
  ): Promise<{ id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.findOne(recordsId);
      const _children = children.map((child) => ({
        ...child,
        recordsId,
      }));
      const recordRepository = queryRunner.manager.getRepository(Record);
      const childRepository = queryRunner.manager.getRepository(Child);

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
    } catch (err) {
      console.log('Rolling Back ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createStepFive(
    updatePolicyDto: UpdatePolicyDto[],
    recordsId: number,
  ): Promise<{ id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.findOne(recordsId);
      const policies = updatePolicyDto.map((policy) => ({
        ...policy,
        recordsId,
      }));

      const policyRepository = queryRunner.manager.getRepository(Policy);
      await policyRepository.delete({ recordsId });
      await policyRepository.insert(policies);

      await queryRunner.commitTransaction();
      return {
        id: recordsId,
      };
    } catch (err) {
      console.log('Rolling Back ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createStepSix(
    documentDto: DocumentDto[],
    recordsId: number,
  ): Promise<{ id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.findOne(recordsId);
      const _document = documentDto.map((document) => ({
        ...document,
        recordsId,
      }));
      const documentRepository = queryRunner.manager.getRepository(Document);
      await documentRepository.delete({ recordsId });
      await documentRepository.insert(_document);

      await queryRunner.commitTransaction();
      return {
        id: recordsId,
      };
    } catch (err) {
      console.log('Rolling Back ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    search: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<{ data: Record[]; total: number }> {
    try {
      const userId = this.request.user.sub;
      const [data, total] = await this.recordRepository.findAndCount({
        relations: ['addresses', 'children', 'policies', 'documents'],
        where: search
          ? [
              {
                userId,
                firstName: ILike(`%${search}%`),
              },
              {
                userId,
                lastName: ILike(`%${search}%`),
              },
              {
                userId,
                email: ILike(`%${search}%`),
              },
              {
                userId,
                mobileNumber: ILike(`%${search}%`),
              },
            ]
          : {
              userId,
            },

        order: { [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return { data, total };
    } catch (err) {
      console.error('Error finding records:', err);
      throw new InternalServerErrorException('Error finding records');
    }
  }

  async findOne(id: number): Promise<Record> {
    const userId = this.request.user.sub;

    const record = await this.recordRepository.findOne({
      relations: ['addresses', 'children', 'policies', 'documents'],
      where: { id, userId },
    });
    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
    return record;
  }

  async findOneByEmail(email: string): Promise<Record> {
    try {
      const record = await this.recordRepository.findOne({ where: { email } });
      if (!record) {
        throw new NotFoundException(`Record with email ${email} not found`);
      }
      return record;
    } catch (err) {
      console.error('Error finding record by email:', err);
      throw new InternalServerErrorException('Error finding record by email');
    }
  }

  async remove(id: number): Promise<void> {
    const userId = this.request.user.sub;
    try {
      const result = await this.recordRepository.delete({ id, userId });
      if (result.affected === 0) {
        throw new NotFoundException(`Record with ID ${id} not found`);
      }
      await this.esService.deleteDocumentById(String(id), this.elasticIndex);
    } catch (err) {
      console.error('Error removing record:', err);
      throw new InternalServerErrorException('Error removing record');
    }
  }

  async searchRecords(query: string) {
    return this.esService.searchRecords(query, this.elasticIndex);
  }
}
