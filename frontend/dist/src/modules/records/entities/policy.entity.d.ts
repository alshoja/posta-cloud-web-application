import { Record } from './record.entity';
export declare class Policy {
    id: number;
    type: string;
    number: string;
    records: Record;
    recordsId: number;
}
