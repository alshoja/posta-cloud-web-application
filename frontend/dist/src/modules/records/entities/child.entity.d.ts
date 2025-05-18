import { Record } from './record.entity';
import { Gender } from '../enums/gender.enum';
export declare class Child {
    id: number;
    name: string;
    dateOfBirth: string;
    gender: Gender;
    records: Record;
    recordsId: number;
}
