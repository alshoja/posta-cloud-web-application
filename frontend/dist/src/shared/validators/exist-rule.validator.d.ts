import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { DataSource } from 'typeorm';
export declare class ExistsRule implements ValidatorConstraintInterface {
    private dataSource;
    constructor(dataSource: DataSource);
    validate(value: number | string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
