import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { useSnackbarStore } from './stores/snackbar.store'
import { useLoaderStore } from './stores/loader.store'
import { useAuthStore } from './stores/auth'

const baseUrl = import.meta.env.VITE_API_URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const loaderStore = useLoaderStore()

    loaderStore.startLoading()
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  },
  (error: AxiosError) => {
    const loaderStore = useLoaderStore()

    loaderStore.stopLoading()
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const loaderStore = useLoaderStore()

    loaderStore.stopLoading()
    return response
  },
  (error: AxiosError) => {
    const snackbar = useSnackbarStore()
    const authStore = useAuthStore()
    let errorMessage = 'An unexpected error occurred. Please try again later.'
    if (error.response) {
      console.error('Error Response:', error.response)
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please log in again.'
        snackbar.showSnackbar(errorMessage, 'error', [])

        authStore.logout()
        return Promise.reject(error)
      }

      errorMessage =
        (error.response.data as { message?: string })?.message ||
        `Error ${error.response.status}: ${error.response.statusText}` ||
        errorMessage
    } else if (error.request) {
      console.error('No Response:', error.request)
      errorMessage = 'No response received from the server. Please check your internet connection.'
    } else {
      console.error('Error:', error.message)
      errorMessage = error.message || errorMessage
    }

    snackbar.showSnackbar(errorMessage, 'error', [])
    const loaderStore = useLoaderStore()

    loaderStore.stopLoading()
    return Promise.reject(error)
  }
)

export default axiosInstance
