export declare class CreateOccupationDto {
    redirectionAddress: boolean;
    isAbroad: boolean;
    redirectedHouseName: string;
    redirectedHouseNumber: string;
    job: string;
    retirementDate: string;
    isRedirected: boolean;
    addresses: AddressDto[];
}
export declare class AddressDto {
    id: number;
    houseName: string;
    houseNumber: string;
    streetName: string;
    streetNumber: string;
    village: string;
    postOffice: string;
    locationType: string;
}
declare const UpdateOccupationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateOccupationDto>>;
export declare class UpdateOccupationDto extends UpdateOccupationDto_base {
}
export {};
