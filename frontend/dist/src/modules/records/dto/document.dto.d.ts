export declare class DocumentDto {
    name: string;
    file: string;
    recordsId: number;
}
declare const UpdateDocumentDto_base: import("@nestjs/mapped-types").MappedType<Partial<DocumentDto>>;
export declare class UpdateDocumentDto extends UpdateDocumentDto_base {
}
export {};
