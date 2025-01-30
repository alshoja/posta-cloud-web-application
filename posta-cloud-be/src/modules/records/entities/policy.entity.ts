import { Record } from './record.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  number: string;

  @ManyToOne(() => Record, (records) => records.policies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordsId' })
  records: Record;

  @Column({ nullable: false })
  recordsId: number;
}
