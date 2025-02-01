import axios from '@/axiosInstance.interceptor'
import type {
  PaginatedRecords,
  RecordDetail,
  StepFive,
  StepFour,
  StepOne,
  StepSix,
  StepThree,
  StepTwo
} from '@/interfaces/record.interface'
import { defineStore } from 'pinia'

const baseUrl = `${import.meta.env.VITE_API_URL}/records`
export const useRecordStore = defineStore('Record', {
  state: () => ({
    records: {} as PaginatedRecords,
    record: {} as RecordDetail
  }),
  actions: {
    async createPersonalData(formData: StepOne): Promise<{ id: number }> {
      try {
        const response = await axios.post(`${baseUrl}/step/one`, formData, {
          headers: { 'Content-Type': 'application/json' }
        })
        return response.data
      } catch (err) {
        console.error('Error creating record:', err)
        throw err
      }
    },
    async createIdentificationData(formData: StepTwo, id: string) {
      try {
        const response = await axios.post(`${baseUrl}/step/two/${id}`, formData, {
          headers: { 'Content-Type': 'application/json' }
        })
        return response.data
      } catch (err) {
        console.error('Error creating record:', err)
        throw err
      }
    },
    async createOccupationData(formData: StepThree, id: string) {
      try {
        const response = await axios.post(`${baseUrl}/step/three/${id}`, formData, {
          headers: { 'Content-Type': 'application/json' }
        })
        return response.data
      } catch (err) {
        console.error('Error creating record:', err)
        throw err
      }
    },
    async createFamilyData(formData: StepFour, id: string) {
      try {
        const response = await axios.post(`${baseUrl}/step/four/${id}`, formData, {
          headers: { 'Content-Type': 'application/json' }
        })
        return response.data
      } catch (err) {
        console.error('Error creating record:', err)
        throw err
      }
    },
    async createPolicyData({ policies }: StepFive, id: string) {
      try {
        const response = await axios.post(`${baseUrl}/step/five/${id}`, policies, {
          headers: { 'Content-Type': 'application/json' }
        })
        return response.data
      } catch (err) {
        console.error('Error creating record:', err)
        throw err
      }
    },
    async createDocumentsData({ documents }: StepSix, id: string) {
      try {
        const response = await axios.post(`${baseUrl}/step/six/${id}`, documents, {
          headers: { 'Content-Type': 'application/json' }
        })
        return response.data
      } catch (err) {
        console.error('Error creating record:', err)
        throw err
      }
    },
    async fetchAllRecords({
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'DESC'
    } = {}) {
      try {
        const response = await axios.get(baseUrl, {
          params: {
            search,
            page,
            limit,
            sortBy,
            sortOrder
          }
        })
        this.records = response.data
      } catch (err) {
        console.error('Failed to fetch records:', err)
      }
    },
    async elasticSearchOnRecords({
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'DESC'
    } = {}) {
      try {
        const response = await axios.get(baseUrl+'/elastic/search', {
          params: {
            query: search,
            page,
            limit,
            sortBy,
            sortOrder
          }
        })
        this.records = response.data
      } catch (err) {
        console.error('Failed to fetch records:', err)
      }
    },
    async fetchRecordById(id: string) {
      try {
        const response = await axios.get(`${baseUrl}/${id}`)
        this.record = response.data
      } catch (err) {
        console.error('Error fetching record:', err)
        throw err
      }
    },
    async remove(id: string) {
      try {
        const response = await axios.delete(`${baseUrl}/${id}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        return response.data
      } catch (err) {
        console.error('Error creating record:', err)
        throw err
      }
    },
    addRecord(newRecord: StepOne) {
      this.records.data = [...this.records.data, newRecord] // ✅ Replacing state reactively
    }
  }
})
