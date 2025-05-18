import { Gender } from '../enums/gender.enum';
export declare class CreateProfileDto {
    id: number;
    profileImage: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    houseName: string;
    houseNumber: string;
    streetName: string;
    streetNumber: string;
    postOffice: number;
    panchayat: string;
    district: string;
    mobileNumber: string;
    whatsappNumber?: string;
    village?: string;
    dateOfBirth?: string;
    userId?: number;
}
declare const UpdateProfileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProfileDto>>;
export declare class UpdateProfileDto extends UpdateProfileDto_base {
}
export {};
