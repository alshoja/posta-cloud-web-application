import { defineStore } from 'pinia'
import { router } from '@/router'
import axiosInstance from '@/axiosInstance.interceptor'

const baseUrl = `${import.meta.env.VITE_API_URL}`
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      const response = await axiosInstance.post(`${baseUrl}/auth/login`, { username, password })
      const { user, access_token } = response.data

      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', access_token)
      router.push(this.returnUrl || '/dashboard/default')
    },
    async register(username: string, password: string, firstName: string, lastName: string) {
      await axiosInstance.post(`${baseUrl}/users`, {
        username,
        password,
        firstName,
        lastName
      })
      router.push(this.returnUrl || '/auth/login')
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/auth/login')
    }
  }
})
