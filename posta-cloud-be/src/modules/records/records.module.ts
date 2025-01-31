import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { SharedModule } from 'src/shared/shared.module';
@Module({
  imports: [TypeOrmModule.forFeature([Record]), SharedModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
