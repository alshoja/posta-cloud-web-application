import { Module } from '@nestjs/common';
import { ExistsRule } from 'src/shared/validators/exist-rule.validator';
import { ValidateFile } from './validators/file.validator';

@Module({
  imports: [],
  providers: [ExistsRule, ValidateFile],
})
export class SharedModule {}
