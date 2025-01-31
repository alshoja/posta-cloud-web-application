import type {
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
  StepSix,
  RecordDetail
} from '@/interfaces/record.interface'
import { defineStore } from 'pinia'
export const useRecordStore = defineStore('Record', {
  state: () => ({
    records: {
      data: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          dateOfBirth: '1990-01-01',
          gender: 'male',
          mobileNumber: '1234567890',
          whatsappNumber: '1234567890',
          houseName: 'Sunset Villa',
          houseNumber: '12A',
          streetName: 'Main Street',
          streetNumber: '101',
          village: 'Greenwood',
          postOffice: '685553',
          locationType: 'Urban',
          panchayat: 'Greenwood Panchayat',
          district: 'Central District',
          addresses: [],
          policies: [],
          documents: [],
          createdAt: new Date()
        }
      ],
      total: 1
    },
    record: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      mobileNumber: '1234567890',
      whatsappNumber: '1234567890',
      houseName: 'Sunset Villa',
      houseNumber: '12A',
      streetName: 'Main Street',
      streetNumber: '101',
      village: 'Greenwood',
      postOffice: 'Greenwood PO',
      locationType: 'Urban',
      panchayat: 'Greenwood Panchayat',
      district: 'Central District',
      addresses: [],
      policies: [],
      documents: [],
      createdAt: new Date()
    }
  }),
  actions: {
    async createPersonalData(formData: StepOne) {
      console.log('Mock createPersonalData called with:', formData)
      return { id: Math.floor(Math.random() * 1000).toString() }
    },
    async createIdentificationData(formData: StepTwo, id: string) {
      console.log(`Mock createIdentificationData called with ID: ${id}`, formData)
      return { id }
    },
    async createOccupationData(formData: StepThree, id: string) {
      console.log(`Mock createOccupationData called with ID: ${id}`, formData)
      return { id }
    },
    async createFamilyData(formData: StepFour, id: string) {
      console.log(`Mock createFamilyData called with ID: ${id}`, formData)
      return { id }
    },
    async createPolicyData({ policies }: StepFive, id: string) {
      console.log(`Mock createPolicyData called with ID: ${id}`, policies)
      return { id }
    },
    async createDocumentsData({ documents }: StepSix, id: string) {
      console.log(`Mock createDocumentsData called with ID: ${id}`, documents)
      return { id }
    },
    async fetchAllRecords({
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'DESC'
    } = {}) {
      console.log('Mock fetchAllRecords called with:', { search, page, limit, sortBy, sortOrder })
      return this.records
    },
    async fetchRecordById(id: string) {
      console.log(`Mock fetchRecordById called with ID: ${id}`)
      if (this.record.id) return this.record
    },
    async remove(id: string) {
      console.log(`Mock remove called with ID: ${id}`)
      if (this.record.id) this.records.data = this.records.data.filter((record) => record.id !== id)
      return { success: true }
    },
    addRecord(newRecord: StepOne) {
      console.log('Mock addRecord called with:', newRecord)
      this.records.data.push(newRecord)
    }
  }
})
