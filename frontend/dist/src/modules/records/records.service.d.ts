import { DataSource, Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/types/express';
import { DocumentDto } from './dto/document.dto';
import { UpdateFamilyDto } from './dto/family.dto';
import { UpdateIdentityDto } from './dto/identity.dto';
import { UpdateOccupationDto } from './dto/occupation.dto';
import { UpdateProfileDto } from './dto/personal.dto';
import { UpdatePolicyDto } from './dto/policy.dto';
import { Record } from './entities/record.entity';
import { ElasticsearchService } from '../../shared/elastic-search/elasticsearch.service';
export declare class RecordsService {
    private request;
    private readonly recordRepository;
    private dataSource;
    private esService;
    private readonly elasticIndex;
    constructor(request: AuthenticatedRequest, recordRepository: Repository<Record>, dataSource: DataSource, esService: ElasticsearchService);
    createStepOne(updateProfileDto: UpdateProfileDto): Promise<{
        id: number;
    }>;
    createStepTwo(updateIdentityDto: UpdateIdentityDto, recordsId: number): Promise<{
        id: number;
    }>;
    createStepThree({ addresses, ...updateOccupationDto }: UpdateOccupationDto, recordsId: number): Promise<{
        id: number;
    }>;
    createStepFour({ children, ...updateFamilyDto }: UpdateFamilyDto, recordsId: number): Promise<{
        id: number;
    }>;
    createStepFive(updatePolicyDto: UpdatePolicyDto[], recordsId: number): Promise<{
        id: number;
    }>;
    createStepSix(documentDto: DocumentDto[], recordsId: number): Promise<{
        id: number;
    }>;
    findAll(search: string, page: number, limit: number, sortBy: string, sortOrder: 'ASC' | 'DESC'): Promise<{
        data: Record[];
        total: number;
    }>;
    findOne(id: number): Promise<Record>;
    findOneByEmail(email: string): Promise<Record>;
    remove(id: number): Promise<void>;
    searchRecords(query: string): Promise<any>;
}
