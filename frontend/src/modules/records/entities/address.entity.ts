import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Record } from './record.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  houseName: string;

  @Column()
  houseNumber: string;

  @Column()
  streetName: string;

  @Column()
  streetNumber: string;

  @Column()
  village: string;

  @Column()
  postOffice: string;

  @Column()
  locationType: string;

  @ManyToOne(() => Record, (records) => records.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordsId' })
  records: Record;

  @Column({ nullable: false })
  recordsId: number;
}
