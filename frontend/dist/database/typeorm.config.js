"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
console.log('Connecting with password:', configService.get('DB_PASSWORD'));
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
    synchronize: configService.get('nodenv') === 'development',
    logging: configService.get('nodenv') === 'development',
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
});
//# sourceMappingURL=typeorm.config.js.map