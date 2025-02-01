"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const shared_module_1 = require("./shared/shared.module");
const http_exception_filter_1 = require("./shared/filter/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: false,
        skipNullProperties: true,
        skipMissingProperties: true,
        skipUndefinedProperties: true,
        whitelist: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.AllHttpExceptionFilter(app.get(core_1.HttpAdapterHost)));
    (0, class_validator_1.useContainer)(app.select(shared_module_1.SharedModule), { fallbackOnErrors: true });
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map