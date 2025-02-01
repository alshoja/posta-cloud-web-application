import axiosInstance from '@/axiosInstance.interceptor'
import { defineStore } from 'pinia'

const baseUrl = `${import.meta.env.VITE_API_URL}/upload`
export const useFileStore = defineStore('File', {
  state: () => ({
    fileUrl: ''
  }),
  actions: {
    async uploadFile(formData: FormData) {
      try {
        const response = await axiosInstance.post(baseUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.fileUrl = response.data.url
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
      }
    }
  }
})
