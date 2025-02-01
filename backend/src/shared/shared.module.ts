import { Module } from '@nestjs/common';
import { ExistsRule } from 'src/shared/validators/exist-rule.validator';
import { ValidateFile } from './validators/file.validator';
import { ElasticSearchModule } from './elastic-search/elastic-search.module';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [ElasticSearchModule, UsersModule],
  providers: [ExistsRule, ValidateFile],
  exports: [ElasticSearchModule, ExistsRule, ValidateFile, UsersModule],
})
export class SharedModule {}
