import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/types/express';
import { StepFiveDto } from './dto/step-five.dto';
import { StepFourDto } from './dto/step-four.dto';
import { StepOneDto } from './dto/step-one.dto';
import { StepSixDto } from './dto/step-six.dto';
import { StepThreeDto } from './dto/step-three.dto';
import { StepTwoDto } from './dto/step-two.dto';
import { RecordStatus } from './enums/record-status.enum';
import { Address } from './entities/address.entity';
import { Child } from './entities/child.entity';
import { Document } from './entities/document.entity';
import { Policy } from './entities/policy.entity';
import { Record as RecordEntity } from './entities/record.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable({ scope: Scope.REQUEST })
export class RecordsService {
  constructor(
    @Inject(REQUEST)
    private request: AuthenticatedRequest,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    private dataSource: DataSource,
  ) {}

  async createStepOne(
    stepOneDto: StepOneDto,
  ): Promise<{ id: number; status: RecordStatus; lastCompletedStep: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let recordId: number;
      const userId = this.request.user.sub;
      const recordRepository = queryRunner.manager.getRepository(RecordEntity);
      const action = this.resolveAction(stepOneDto.status, 1);
      const { status: _status, ...stepOnePayload } = stepOneDto;
      const createPayload = {
        ...stepOnePayload,
        userId,
        createdBy: userId,
        updatedBy: userId,
      };

      const existingRecord = stepOneDto.id
        ? await recordRepository.findOne({
            where: { id: stepOneDto.id, userId },
          })
        : null;

      if (existingRecord) {
        this.ensureRecordEditable(existingRecord);
        await recordRepository.update(
          { id: stepOneDto.id, userId },
          { ...stepOnePayload, updatedBy: userId },
        );
        recordId = existingRecord.id;
      } else if (stepOneDto.id) {
        throw new NotFoundException(
          `Record with ID ${stepOneDto.id} not found`,
        );
      } else {
        const newRecord = await recordRepository.insert(createPayload);
        recordId = newRecord.identifiers[0].id;
      }

      await this.applyStepAction(recordRepository, recordId, 1, action, userId);
      const record = await recordRepository.findOneOrFail({ where: { id: recordId } });
      await queryRunner.commitTransaction();
      return {
        id: recordId,
        status: record.status,
        lastCompletedStep: record.lastCompletedStep,
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
    stepTwoDto: StepTwoDto,
    recordsId: number,
  ): Promise<{ id: number; status: RecordStatus; lastCompletedStep: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingRecord = await this.findOne(recordsId);
      this.ensureRecordEditable(existingRecord);
      const userId = this.request.user.sub;
      const recordRepository = queryRunner.manager.getRepository(RecordEntity);
      const action = this.resolveAction(stepTwoDto.status, 2);
      const { status: _status, ...stepTwoPayload } = stepTwoDto;
      const hasStepTwoValues = Object.values(stepTwoPayload).some(
        (value) => value !== undefined && value !== null && value !== '',
      );

      if (hasStepTwoValues) {
        const newRecord = recordRepository.create(stepTwoPayload);
        await recordRepository.update(
          { id: recordsId },
          { ...newRecord, updatedBy: userId },
        );
      }
      await this.applyStepAction(recordRepository, recordsId, 2, action, userId);
      const record = await recordRepository.findOneOrFail({ where: { id: recordsId } });
      await queryRunner.commitTransaction();
      return {
        id: recordsId,
        status: record.status,
        lastCompletedStep: record.lastCompletedStep,
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
    { addresses, status, ...updateOccupationDto }: StepThreeDto,
    recordsId: number,
  ): Promise<{ id: number; status: RecordStatus; lastCompletedStep: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingRecord = await this.findOne(recordsId);
      this.ensureRecordEditable(existingRecord);
      const userId = this.request.user.sub;
      const normalizedAddresses = addresses ?? [];
      const _addresses = normalizedAddresses.map((address) => ({
        houseName: this.normalizeNullableString(address.houseName),
        houseNumber: this.normalizeNullableString(address.houseNumber),
        streetName: this.normalizeNullableString(address.streetName),
        streetNumber: this.normalizeNullableString(address.streetNumber),
        village: this.normalizeNullableString(address.village),
        postOffice: this.normalizeNullableString(address.postOffice),
        locationType: this.normalizeNullableString(address.locationType),
        recordsId,
      }));

      const recordRepository = queryRunner.manager.getRepository(RecordEntity);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const stepAction = this.resolveAction(status, 3);

      const createdRecord = recordRepository.create({
        ...updateOccupationDto,
      });

      await addressRepository.delete({ recordsId });
      if (_addresses.length > 0) {
        await addressRepository.insert(_addresses);
      }
      await recordRepository.update(
        { id: recordsId },
        { ...createdRecord, updatedBy: userId },
      );
      await this.applyStepAction(
        recordRepository,
        recordsId,
        3,
        stepAction,
        userId,
      );
      const record = await recordRepository.findOneOrFail({ where: { id: recordsId } });

      await queryRunner.commitTransaction();
      return {
        id: recordsId,
        status: record.status,
        lastCompletedStep: record.lastCompletedStep,
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
    { children, status, ...updateFamilyDto }: StepFourDto,
    recordsId: number,
  ): Promise<{ id: number; status: RecordStatus; lastCompletedStep: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingRecord = await this.findOne(recordsId);
      this.ensureRecordEditable(existingRecord);
      const userId = this.request.user.sub;
      const normalizedChildren = children ?? [];
      const _children = normalizedChildren.map((child) => ({
        ...child,
        recordsId,
      }));
      const stepAction = this.resolveAction(status, 4);
      const recordRepository = queryRunner.manager.getRepository(RecordEntity);
      const childRepository = queryRunner.manager.getRepository(Child);

      await childRepository.delete({ recordsId });
      if (_children.length > 0) {
        await childRepository.insert(_children);
      }
      const hasStepFourValues = Object.values(updateFamilyDto).some(
        (value) => value !== undefined && value !== null && value !== '',
      );

      if (hasStepFourValues) {
        const createdRecord = recordRepository.create({
          ...updateFamilyDto,
        });
        await recordRepository.update(
          { id: recordsId },
          { ...createdRecord, updatedBy: userId },
        );
      }
      await this.applyStepAction(
        recordRepository,
        recordsId,
        4,
        stepAction,
        userId,
      );
      const record = await recordRepository.findOneOrFail({ where: { id: recordsId } });
      await queryRunner.commitTransaction();
      return {
        id: recordsId,
        status: record.status,
        lastCompletedStep: record.lastCompletedStep,
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
    stepFiveDto: StepFiveDto,
    recordsId: number,
  ): Promise<{ id: number; status: RecordStatus; lastCompletedStep: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingRecord = await this.findOne(recordsId);
      this.ensureRecordEditable(existingRecord);
      const userId = this.request.user.sub;
      const action = this.resolveAction(stepFiveDto.status, 5);
      const policies = stepFiveDto.policies.map((policy) => ({
        type: policy.type?.trim() ? policy.type : null,
        number: policy.number?.trim() ? policy.number : null,
        recordsId,
      }));

      const policyRepository = queryRunner.manager.getRepository(Policy);
      const recordRepository = queryRunner.manager.getRepository(RecordEntity);
      await policyRepository.delete({ recordsId });
      await policyRepository.insert(policies);
      await this.applyStepAction(recordRepository, recordsId, 5, action, userId);
      const record = await recordRepository.findOneOrFail({ where: { id: recordsId } });

      await queryRunner.commitTransaction();
      return {
        id: recordsId,
        status: record.status,
        lastCompletedStep: record.lastCompletedStep,
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
    stepSixDto: StepSixDto,
    recordsId: number,
  ): Promise<{ id: number; status: RecordStatus; lastCompletedStep: number }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingRecord = await this.findOne(recordsId);
      this.ensureRecordEditable(existingRecord);
      const userId = this.request.user.sub;
      const action = this.resolveAction(stepSixDto.status, 6);
      const _document = stepSixDto.documents.map((document) => ({
        name: document.name?.trim() ? document.name : null,
        file: document.file?.trim() ? document.file : null,
        recordsId,
      }));
      const documentRepository = queryRunner.manager.getRepository(Document);
      const recordRepository = queryRunner.manager.getRepository(RecordEntity);
      await documentRepository.delete({ recordsId });
      await documentRepository.insert(_document);
      if (action === 'FINAL') {
        await this.validateFinalSubmission(recordRepository, recordsId);
      }
      await this.applyStepAction(recordRepository, recordsId, 6, action, userId);
      const record = await recordRepository.findOneOrFail({ where: { id: recordsId } });

      await queryRunner.commitTransaction();
      return {
        id: recordsId,
        status: record.status,
        lastCompletedStep: record.lastCompletedStep,
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
  ): Promise<{ data: RecordEntity[]; total: number }> {
    try {
      const userId = this.request.user.sub;
      const isAdmin = this.request.user.role === UserRole.ADMIN;
      const normalizedSortOrder = sortOrder.toUpperCase() as 'ASC' | 'DESC';
      const recordSortColumnMap: Record<string, string> = {
        id: 'record.id',
        firstName: 'record.firstName',
        lastName: 'record.lastName',
        email: 'record.email',
        mobileNumber: 'record.mobileNumber',
        gender: 'record.gender',
        createdAt: 'record.createdAt',
        status: 'record.status',
      };
      const mappedRecordSortColumn =
        recordSortColumnMap[sortBy] ?? 'record.createdAt';
      const query = this.recordRepository
        .createQueryBuilder('record')
        .leftJoinAndSelect('record.addresses', 'addresses')
        .leftJoinAndSelect('record.children', 'children')
        .leftJoinAndSelect('record.policies', 'policies')
        .leftJoinAndSelect('record.documents', 'documents')
        .leftJoinAndSelect('record.user', 'user')
        .skip((page - 1) * limit)
        .take(limit);

      if (sortBy === 'addedBy') {
        query
          .orderBy('user.firstName', normalizedSortOrder)
          .addOrderBy('user.lastName', normalizedSortOrder)
          .addOrderBy('record.createdAt', 'DESC');
      } else {
        query.orderBy(mappedRecordSortColumn, normalizedSortOrder);
      }

      if (isAdmin) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('record.status != :draftStatus', {
              draftStatus: RecordStatus.DRAFT,
            }).orWhere('record.userId = :userId', { userId });
          }),
        );
      } else {
        query.andWhere('record.userId = :userId', { userId });
      }

      if (search) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('record.firstName ILIKE :search', { search: `%${search}%` })
              .orWhere('record.lastName ILIKE :search', { search: `%${search}%` })
              .orWhere('record.email ILIKE :search', { search: `%${search}%` })
              .orWhere('record.mobileNumber ILIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }

      const [data, total] = await query.getManyAndCount();

      return { data, total };
    } catch (err) {
      console.error('Error finding records:', err);
      throw new InternalServerErrorException('Error finding records');
    }
  }

  async findOne(id: number): Promise<RecordEntity> {
    const userId = this.request.user.sub;
    const isAdmin = this.request.user.role === UserRole.ADMIN;

    const record = await this.recordRepository.findOne({
      relations: ['addresses', 'children', 'policies', 'documents', 'user'],
      where: isAdmin ? { id } : { id, userId },
    });
    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
    if (record.status === RecordStatus.DRAFT && record.userId !== userId) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
    return record;
  }

  async findOneByEmail(email: string): Promise<RecordEntity> {
    try {
      const record = await this.recordRepository.findOne({ where: { email } });
      if (!record) {
        throw new NotFoundException(`Record with email ${email} not found`);
      }
      return record;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
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
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      console.error('Error removing record:', err);
      throw new InternalServerErrorException('Error removing record');
    }
  }

  async reopen(
    id: number,
  ): Promise<{ id: number; status: RecordStatus; lastCompletedStep: number }> {
    const userId = this.request.user.sub;
    const isAdmin = this.request.user.role === UserRole.ADMIN;

    const record = await this.recordRepository.findOne({
      where: isAdmin ? { id } : { id, userId },
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    record.status = RecordStatus.DRAFT;
    record.completedAt = null;
    record.updatedBy = userId;

    await this.recordRepository.save(record);

    return {
      id: record.id,
      status: record.status,
      lastCompletedStep: record.lastCompletedStep,
    };
  }

  private resolveAction(
    status: RecordStatus | undefined,
    step: number,
  ): 'DRAFT' | 'CONTINUE' | 'FINAL' {
    if (!status) {
      return 'CONTINUE';
    }

    if (status === RecordStatus.DRAFT) {
      return 'DRAFT';
    }
    if (status === RecordStatus.COMPLETED) {
      if (step !== 6) {
        throw new BadRequestException(
          'COMPLETED status is only valid on step six final submission.',
        );
      }
      return 'FINAL';
    }

    throw new BadRequestException(
      'Invalid status. Allowed values are DRAFT or COMPLETED.',
    );
  }

  private ensureRecordEditable(record: RecordEntity) {
    if (record.status === RecordStatus.COMPLETED) {
      throw new BadRequestException(
        'Completed records are locked and cannot be edited.',
      );
    }
  }

  private normalizeNullableString(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
      return null;
    }
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private async applyStepAction(
    recordRepository: Repository<RecordEntity>,
    recordsId: number,
    step: number,
    action: 'DRAFT' | 'CONTINUE' | 'FINAL',
    actorUserId: number,
  ) {
    const record = await recordRepository.findOne({ where: { id: recordsId } });
    if (!record) {
      throw new NotFoundException(`Record with ID ${recordsId} not found`);
    }

    if (action === 'DRAFT') {
      if (record.status !== RecordStatus.COMPLETED) {
        record.status = RecordStatus.DRAFT;
      }
      record.updatedBy = actorUserId;
      await recordRepository.save(record);
      return;
    }

    if (action === 'FINAL') {
      record.status = RecordStatus.COMPLETED;
      record.lastCompletedStep = Math.max(record.lastCompletedStep, step);
      record.completedAt = new Date();
      record.updatedBy = actorUserId;
      await recordRepository.save(record);
      return;
    }

    record.status = RecordStatus.DRAFT;
    record.lastCompletedStep = Math.max(record.lastCompletedStep, step);
    record.completedAt = null;
    record.updatedBy = actorUserId;
    await recordRepository.save(record);
  }

  private async validateFinalSubmission(
    recordRepository: Repository<RecordEntity>,
    recordsId: number,
  ) {
    const record = await recordRepository.findOne({
      where: { id: recordsId },
      relations: ['documents', 'policies'],
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${recordsId} not found`);
    }

    const missingFields: string[] = [];
    if (!record.firstName) missingFields.push('firstName');
    if (!record.email) missingFields.push('email');

    if (missingFields.length > 0) {
      throw new BadRequestException({
        message: 'Final submission is incomplete.',
        missingFields,
      });
    }
  }
}
