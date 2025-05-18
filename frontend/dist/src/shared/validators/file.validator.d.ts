import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class ValidateFile implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    private validateFile;
    defaultMessage(args: ValidationArguments): string;
}
