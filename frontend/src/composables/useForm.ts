import type {
  Address,
  Child,
  IdentityDocument,
  Policy,
  Document,
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
  StepSix
} from '@/interfaces/record.interface'

export function useForm() {
  const createAddress = (): Address => ({
    houseName: '',
    houseNumber: '',
    streetName: '',
    streetNumber: '',
    village: '',
    postOffice: '',
    locationType: ''
  })

  const createChild = (): Child => ({
    name: '',
    dateOfBirth: '',
    gender: ''
  })

  const createDocument = (): Document => ({
    name: '',
    file: ''
  })

  const createPolicy = (): Policy => ({
    type: '',
    number: ''
  })

  const createIdentityDocument = (): IdentityDocument => ({
    type: '',
    number: ''
  })

  const stepOneInitialState: StepOne = {
    valid: false,
    id: '',
    profileImage: '',
    email: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    mobileNumber: '',
    whatsappNumber: '',
    dateOfBirth: '',
    gender: '',
    children: [createChild()],
    redirectionAddress: false,
    isAbroad: false,
    isRedirected: false
  }

  const stepTwoInitialState: StepTwo = {
    valid: false,
    password: '',
    identityDocuments: [createIdentityDocument()]
  }

  const stepThreeInitialState: StepThree = {
    valid: false,
    redirectionAddress: false,
    isAbroad: false,
    ...createAddress(),
    job: '',
    retirementDate: '',
    isRedirected: false,
    redirectedHouseName: '',
    redirectedHouseNumber: '',
    addresses: [createAddress()]
  }

  const stepFourInitialState: StepFour = {
    valid: true,
    marriageDate: '',
    previousAddress: '',
    children: [createChild()]
  }

  const stepFiveInitialState: StepFive = {
    valid: true,
    policies: [createPolicy()]
  }

  const stepSixInitialState: StepSix = {
    valid: true,
    documents: [createDocument()]
  }

  return {
    stepOneInitialState,
    stepTwoInitialState,
    stepThreeInitialState,
    stepFourInitialState,
    stepFiveInitialState,
    stepSixInitialState
  }
}
