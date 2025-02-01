import { DocumentDto } from './dto/document.dto';
import { UpdateFamilyDto } from './dto/family.dto';
import { UpdateIdentityDto } from './dto/identity.dto';
import { UpdateOccupationDto } from './dto/occupation.dto';
import { UpdateProfileDto } from './dto/personal.dto';
import { UpdatePolicyDto } from './dto/policy.dto';
import { RecordsService } from './records.service';
export declare class RecordsController {
    private readonly recordsService;
    constructor(recordsService: RecordsService);
    createStepOne(updateProfileDto: UpdateProfileDto): Promise<{
        id: number;
    }>;
    createStepTwo(updateIdentityDto: UpdateIdentityDto, recordsId: number): Promise<{
        id: number;
    }>;
    createStepThree(updateOccupationDto: UpdateOccupationDto, recordsId: number): Promise<{
        id: number;
    }>;
    createStepFour(updateFamilyDto: UpdateFamilyDto, recordsId: number): Promise<{
        id: number;
    }>;
    createStepFive(updatePolicyDto: UpdatePolicyDto[], recordsId: number): Promise<{
        id: number;
    }>;
    createStepSix(updateDocumentDto: DocumentDto[], recordsId: number): Promise<{
        id: number;
    }>;
    findAll(search: string, page?: number, limit?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{
        data: import("./entities/record.entity").Record[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/record.entity").Record>;
    remove(id: string): Promise<void>;
    search(query: string): Promise<any>;
}
