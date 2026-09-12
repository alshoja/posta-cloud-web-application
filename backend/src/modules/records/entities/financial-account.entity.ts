import { Transform } from 'class-transformer';
import { Record } from './record.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { EncryptionUtility } from '../../../utilities/encryption.utility';

@Entity('financial_accounts')
export class FinancialAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  @Transform(
    ({ value }) => (value ? EncryptionUtility.decrypt(value) : value),
    {
      toPlainOnly: true,
    },
  )
  number: string;

  @ManyToOne(() => Record, (records) => records.financialAccounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordsId' })
  records: Relation<Record>;

  @Column({ nullable: false })
  recordsId: number;
}
