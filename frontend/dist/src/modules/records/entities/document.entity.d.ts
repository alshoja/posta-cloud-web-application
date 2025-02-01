import { Record } from './record.entity';
export declare class Document {
    id: number;
    name: string;
    file: string;
    records: Record;
    recordsId: number;
}
