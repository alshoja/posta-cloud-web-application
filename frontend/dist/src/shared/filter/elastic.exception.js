"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchConnectionException = void 0;
const common_1 = require("@nestjs/common");
class ElasticsearchConnectionException extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.SERVICE_UNAVAILABLE);
    }
}
exports.ElasticsearchConnectionException = ElasticsearchConnectionException;
//# sourceMappingURL=elastic.exception.js.map