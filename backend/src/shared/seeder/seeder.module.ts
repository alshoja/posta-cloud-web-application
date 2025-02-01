import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Record } from '../../modules/records/entities/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  providers: [SeederService],
})
export class SeederModule {}
