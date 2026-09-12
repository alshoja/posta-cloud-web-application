import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Gender } from '../enums/gender.enum';
import { RecordStatus } from '../enums/record-status.enum';
import { Address } from './address.entity';
import { Child } from './child.entity';
import { Document } from './document.entity';
import { IdentityDocument } from './identity-document.entity';
import { Policy } from './policy.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  whatsappNumber: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({ nullable: true })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ default: false })
  redirectionAddress: boolean;

  @Column({ default: false })
  isAbroad: boolean;

  @Column({ nullable: true })
  redirectedAddressLine1: string;

  @Column({ nullable: true })
  redirectedAddressLine2: string;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  retirementDate: string;

  @Column({ default: false })
  isRedirected: boolean;

  @Column({ nullable: true })
  postalCode: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.DRAFT,
  })
  status: RecordStatus;

  @Column({ type: 'int', default: 0 })
  lastCompletedStep: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @OneToMany(() => Address, (address) => address.records, {
    cascade: true,
  })
  @JoinColumn()
  addresses: Relation<Address>[];

  @Column({ nullable: true })
  marriageDate: string;

  @Column({ nullable: true })
  previousAddress: string;

  @OneToMany(() => Child, (child) => child.records, { cascade: true })
  @JoinColumn()
  children:  Relation<Child>[];

  @OneToMany(() => Document, (document) => document.records, {
    cascade: true,
  })
  @JoinColumn()
  documents:  Relation<Document>[];

  @OneToMany(() => Policy, (policy) => policy.records, {
    cascade: true,
  })
  @JoinColumn()
  policies:  Relation<Policy>[];

  @OneToMany(() => IdentityDocument, (identityDocument) => identityDocument.records, {
    cascade: true,
  })
  @JoinColumn()
  identityDocuments:  Relation<IdentityDocument>[];

  @ManyToOne(() => User, (user) => user.records, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user:  Relation<User>;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: false })
  updatedBy: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
