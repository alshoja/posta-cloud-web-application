import { HttpException } from '@nestjs/common';
export declare class ElasticsearchConnectionException extends HttpException {
    constructor(message: string);
}
