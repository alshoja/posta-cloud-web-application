import { Transform } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Gender } from '../enums/gender.enum';
import { Address } from './address.entity';
import { Child } from './child.entity';
import { Document } from './document.entity';
import { Policy } from './policy.entity';
import { EncryptionUtility } from '../../../utilities/encryption.utility';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  postBoxNumber: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
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
  houseName: string;

  @Column({ nullable: true })
  houseNumber: string;

  @Column({ nullable: true })
  streetName: string;

  @Column({ nullable: true })
  streetNumber: string;

  @Column({ nullable: true })
  panchayat: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  @Transform(
    ({ value }) => (value ? EncryptionUtility.decrypt(value) : value),
    {
      toPlainOnly: true,
    },
  )
  aadhaarNumber: string;

  @Column({ nullable: true })
  @Transform(
    ({ value }) => (value ? EncryptionUtility.decrypt(value) : value),
    {
      toPlainOnly: true,
    },
  )
  drivingLicense: string;

  @Column({ nullable: true })
  @Transform(
    ({ value }) => (value ? EncryptionUtility.decrypt(value) : value),
    {
      toPlainOnly: true,
    },
  )
  electionID: string;

  @Column({ nullable: true })
  @Transform(
    ({ value }) => (value ? EncryptionUtility.decrypt(value) : value),
    {
      toPlainOnly: true,
    },
  )
  passportNumber: string;

  @Column({ default: false })
  redirectionAddress: boolean;

  @Column({ default: false })
  isAbroad: boolean;

  @Column({ nullable: true })
  redirectedHouseName: string;

  @Column({ nullable: true })
  redirectedHouseNumber: string;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  retirementDate: string;

  @Column({ default: false })
  isRedirected: boolean;

  @Column({ nullable: false })
  postOffice: number;

  @OneToMany(() => Address, (address) => address.records, {
    cascade: true,
  })
  @JoinColumn()
  addresses: Address[];

  @Column({ nullable: true })
  marriageDate: string;

  @Column({ nullable: true })
  village: string;

  @Column({ nullable: true })
  previousAddress: string;

  @OneToMany(() => Child, (child) => child.records, { cascade: true })
  @JoinColumn()
  children: Child[];

  @OneToMany(() => Document, (document) => document.records, {
    cascade: true,
  })
  @JoinColumn()
  documents: Document[];

  @OneToMany(() => Policy, (policy) => policy.records, {
    cascade: true,
  })
  @JoinColumn()
  policies: Policy[];

  @ManyToOne(() => User, (user) => user.records, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptSensitiveInformation() {
    if (this.aadhaarNumber && !this.aadhaarNumber.startsWith('iv:')) {
      this.aadhaarNumber = EncryptionUtility.encrypt(this.aadhaarNumber);
    }
    if (this.electionID && !this.electionID.startsWith('iv:')) {
      this.electionID = EncryptionUtility.encrypt(this.electionID);
    }
    if (this.passportNumber && !this.passportNumber.startsWith('iv:')) {
      this.passportNumber = EncryptionUtility.encrypt(this.passportNumber);
    }
    if (this.drivingLicense && !this.drivingLicense.startsWith('iv:')) {
      this.drivingLicense = EncryptionUtility.encrypt(this.drivingLicense);
    }
  }
}
