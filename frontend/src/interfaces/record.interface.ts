export interface Address {
  id?: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  locationType: string
}

export type RecordStatus = 'DRAFT' | 'COMPLETED'

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

export interface IdentityDocument {
  id?: string
  type: string
  number: string
}

export interface IdentityDocuments {
  identityDocuments?: IdentityDocument[]
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
  extractionStatus?: 'PENDING' | 'PROCESSING' | 'READY' | 'UNSUPPORTED' | 'FAILED'
  extractionError?: string
  indexedAt?: Date
  searchIndexStatus?: 'NOT_INDEXED' | 'INDEXING' | 'INDEXED' | 'FAILED' | 'DISABLED'
  searchIndexedAt?: Date
  searchIndexError?: string
}

export interface Policy {
  id?: string
  type: string
  number: string
}

export interface RecordDetail
  extends Person,
    Contact,
    IdentityDocuments,
    MarriageInfo,
    RedirectionAddress {
  id?: string
  profileImage?: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  addresses?: Address[]
  policies?: Policy[]
  documents?: Document[]
  user?: {
    id: number
    firstName?: string
    lastName?: string
    email: string
  }
  status?: RecordStatus
  lastCompletedStep?: number
  createdAt?: Date
}

export interface StepOne extends RecordDetail {
  valid: boolean
  status?: RecordStatus
}

export interface StepTwo {
  valid: boolean
  password?: string
  status?: RecordStatus
  identityDocuments: IdentityDocument[]
}

export interface RedirectionAddress {
  valid: boolean
  redirectionAddress: boolean
  isAbroad: boolean
  redirectedAddressLine1?: string
  redirectedAddressLine2?: string
  redirectedAddress?: Address
  job?: string
  retirementDate?: string
  isRedirected: boolean
}

export interface StepThree extends RedirectionAddress {
  addresses: Address[]
  status?: RecordStatus
}

export interface MarriageInfo {
  marriageDate?: string
  previousAddress?: string
  children?: Child[]
}

export interface StepFour extends MarriageInfo {
  valid: boolean
  status?: RecordStatus
}

export interface StepFive {
  valid: boolean
  status?: RecordStatus
  policies: Policy[]
}

export interface StepSix {
  valid: boolean
  status?: RecordStatus
  documents: Document[]
}

export interface PaginatedRecords {
  data: RecordDetail[]
  total: number
}
