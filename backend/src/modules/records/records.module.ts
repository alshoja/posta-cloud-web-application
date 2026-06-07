import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { DocumentIndexModule } from '../ai/document-index/document-index.module';
import { RecordQueryService } from './record-query.service';
@Module({
  imports: [TypeOrmModule.forFeature([Record]), DocumentIndexModule],
  controllers: [RecordsController],
  providers: [RecordsService, RecordQueryService],
  exports: [RecordQueryService],
})
export class RecordsModule {}
