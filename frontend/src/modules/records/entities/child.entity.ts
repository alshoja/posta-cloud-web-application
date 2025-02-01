import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Record } from './record.entity';
import { Gender } from '../enums/gender.enum';

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dateOfBirth: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @ManyToOne(() => Record, (records) => records.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordsId' })
  records: Record;

  @Column({ nullable: false })
  recordsId: number;
}
