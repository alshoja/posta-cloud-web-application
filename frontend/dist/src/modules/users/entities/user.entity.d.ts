import { Record } from '../../records/entities/record.entity';
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    isActive: boolean;
    records: Record[];
    hashPassword(): Promise<void>;
}
