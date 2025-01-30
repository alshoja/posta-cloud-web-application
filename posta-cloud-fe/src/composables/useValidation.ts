import { reactive } from 'vue'

export function useValidation() {
  const validationRules = reactive({
    onlyNumbers: (value: string) => /^\d*$/.test(value) || 'Only numbers are allowed.',
    // General
    required: (value: string) => {
      return !!value || 'This field is required.'
    },
    minLength: (min: number) => (value: string) => {
      return String(value).length >= min || `Minimum ${min} characters required.`
    },
    maxLength: (max: number) => (value: string) => {
      return String(value).length <= max || `Maximum ${max} characters allowed.`
    },
    pattern: (regex: RegExp, message: string) => (value: string) => {
      return regex.test(value) || message
    },

    // Email
    email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',

    // Mobile Number
    mobileNumber: (value: string) => /^\d{10}$/.test(value) || 'Mobile number must be 10 digits.',

    // Aadhaar Number
    aadhaarNumber: (value: string) => /^\d{12}$/.test(value) || 'Aadhaar number must be 12 digits.',

    // Date of Birth
    dateOfBirth: (value: string) => {
      const today = new Date()
      const birthDate = new Date(value)
      return birthDate < today || 'Date of birth must be in the past.'
    },

    // Gender
    gender: (value: string) =>
      ['male', 'female', 'other'].includes(value) || 'Gender must be Male, Female, or Other.',

    // Policies
    policyNumber: (value: string) =>
      /^[A-Z0-9]{8,12}$/.test(value) || 'Policy number must be 8-12 alphanumeric characters.',

    // Dynamic rules for children or arrays
    childName: (value: string) => !!value || 'Child name is required.',
    childGender: (value: string) =>
      ['Male', 'Female', 'Other'].includes(value) || 'Child gender must be Male, Female, or Other.',
    childDateOfBirth: (value: string) => {
      const today = new Date()
      const birthDate = new Date(value)
      return birthDate < today || "Child's date of birth must be in the past."
    }
  })

  return validationRules
}
