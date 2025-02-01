import { Record } from './record.entity';
export declare class Address {
    id: number;
    houseName: string;
    houseNumber: string;
    streetName: string;
    streetNumber: string;
    village: string;
    postOffice: string;
    locationType: string;
    records: Record;
    recordsId: number;
}
