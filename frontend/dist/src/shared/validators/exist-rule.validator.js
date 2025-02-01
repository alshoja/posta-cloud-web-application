"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistsRule = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let ExistsRule = class ExistsRule {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async validate(value, args) {
        const { constraints } = args;
        if (constraints.length === 0) {
            throw new common_1.BadRequestException(`Failed validating ${value} exists.`);
        }
        const str = constraints[0].split(':');
        const tableName = str[0];
        const columnName = str[1];
        const ignoreFieldName = str[2];
        const ignoreId = args.object[ignoreFieldName];
        let query = `SELECT count(*) FROM ${tableName} WHERE "${columnName}" = $1`;
        const params = [value];
        if (ignoreId) {
            query += ` AND id != $2`;
            params.push(Number(ignoreId));
        }
        const result = await this.dataSource.query(query, params);
        if (result[0].count > 0) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        const { property, value } = args;
        return `${property} ${value} is already exist.`;
    }
};
exports.ExistsRule = ExistsRule;
exports.ExistsRule = ExistsRule = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ExistsRule', async: true }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ExistsRule);
//# sourceMappingURL=exist-rule.validator.js.map