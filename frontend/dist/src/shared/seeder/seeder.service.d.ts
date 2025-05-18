import { Repository } from 'typeorm';
import { Record } from '../../modules/records/entities/record.entity';
export declare class SeederService {
    private readonly recordRepository;
    constructor(recordRepository: Repository<Record>);
    seedRecords(numRecords: number): Promise<void>;
}
