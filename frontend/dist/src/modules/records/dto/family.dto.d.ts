import { Gender } from '../enums/gender.enum';
export declare class CreateFamilyDto {
    marriageDate: string;
    previousAddress: string;
    children: ChildDto[];
}
export declare class ChildDto {
    name: string;
    dateOfBirth: string;
    gender: Gender;
}
declare const UpdateFamilyDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateFamilyDto>>;
export declare class UpdateFamilyDto extends UpdateFamilyDto_base {
}
export {};
