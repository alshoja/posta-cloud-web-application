import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Record } from './record.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  file: string;

  @ManyToOne(() => Record, (records) => records.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordsId' })
  records: Record;

  @Column({ nullable: false })
  recordsId: number;
}
