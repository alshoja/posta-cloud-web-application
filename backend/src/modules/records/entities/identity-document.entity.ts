import { Transform } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Record } from './record.entity';
import { EncryptionUtility } from '../../../utilities/encryption.utility';

@Entity('identity_documents')
export class IdentityDocument {
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

  @ManyToOne(() => Record, (records) => records.identityDocuments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordsId' })
  records: Relation<Record>;

  @Column({ nullable: false })
  recordsId: number;
}
