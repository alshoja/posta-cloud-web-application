export declare class CreateIdentityDto {
    aadhaarNumber?: string;
    drivingLicense?: string;
    electionID?: string;
    passportNumber?: string;
    postBoxNumber?: number;
}
declare const UpdateIdentityDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateIdentityDto>>;
export declare class UpdateIdentityDto extends UpdateIdentityDto_base {
}
export {};
