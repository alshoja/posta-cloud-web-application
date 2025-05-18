export declare class CreatePolicyDto {
    type: string;
    number: string;
}
declare const UpdatePolicyDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePolicyDto>>;
export declare class UpdatePolicyDto extends UpdatePolicyDto_base {
}
export {};
