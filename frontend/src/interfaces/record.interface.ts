export interface Address {
  id?: string
  houseName: string
  houseNumber: string
  streetName: string
  streetNumber: string
  village: string
  postOffice: string
  locationType: string
}

export interface Person {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  gender: string
}

export interface Contact {
  mobileNumber: string
  whatsappNumber: string
}

export interface IdentityDocuments {
  aadhaarNumber?: string
  drivingLicense?: string
  electionID?: string
  passportNumber?: string
  postBoxNumber?: string
}

export interface Child {
  id?: string
  name: string
  dateOfBirth: string
  gender: string
}

export interface Document {
  id?: string
  name: string
  file: string
}

export interface Policy {
  id?: string
  type: string
  number: string
}

export interface RecordDetail
  extends Person,
    Contact,
    Address,
    IdentityDocuments,
    MarriageInfo,
    RedirectionAddress {
  id?: string
  profileImage?: string
  address: Address
  panchayat: string
  district: string
  addresses?: Address[]
  policies?: Policy[]
  documents?: Document[]
  createdAt?: Date
}

export interface StepOne extends RecordDetail {
  valid: boolean
}

export interface StepTwo extends IdentityDocuments {
  valid: boolean
  password?: string
}

export interface RedirectionAddress {
  valid: boolean
  redirectionAddress: boolean
  isAbroad: boolean
  redirectedHouseName?: string
  redirectedHouseNumber?: string
  redirectedAddress?: Address
  job?: string
  retirementDate?: string
  isRedirected: boolean
}

export interface StepThree extends RedirectionAddress {
  addresses: Address[]
}

export interface MarriageInfo {
  marriageDate?: string
  previousAddress?: string
  children?: Child[]
}

export interface StepFour extends MarriageInfo {
  valid: boolean
}

export interface StepFive {
  valid: boolean
  policies: Policy[]
}

export interface StepSix {
  valid: boolean
  documents: Document[]
}

export interface PaginatedRecords {
  data: RecordDetail[]
  total: number
}
