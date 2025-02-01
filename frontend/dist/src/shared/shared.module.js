"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const exist_rule_validator_1 = require("./validators/exist-rule.validator");
const file_validator_1 = require("./validators/file.validator");
const elastic_search_module_1 = require("./elastic-search/elastic-search.module");
const users_module_1 = require("../modules/users/users.module");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [elastic_search_module_1.ElasticSearchModule, users_module_1.UsersModule],
        providers: [exist_rule_validator_1.ExistsRule, file_validator_1.ValidateFile],
        exports: [elastic_search_module_1.ElasticSearchModule, exist_rule_validator_1.ExistsRule, file_validator_1.ValidateFile, users_module_1.UsersModule],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map