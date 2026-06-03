import axios from '@/axiosInstance.interceptor'
import type { AxiosError } from 'axios'
import type { RecordDetail } from '@/interfaces/record.interface'
import { defineStore } from 'pinia'

export type AiChatMessageRole = 'user' | 'assistant'

export type AiChatRecordResult = Pick<
    RecordDetail,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'mobileNumber'
    | 'status'
    | 'village'
    | 'panchayat'
    | 'district'
  >

export interface AiChatMessage {
  id: string
  role: AiChatMessageRole
  content: string
  records?: AiChatRecordResult[]
}

interface AiChatResponse {
  role?: AiChatMessageRole
  answer?: string
  records?: AiChatRecordResult[]
}

const baseUrl = `${import.meta.env.VITE_API_URL}/ai-chat/message`

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const getAiChatErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>
  const responseMessage = axiosError.response?.data?.message

  if (responseMessage) {
    return responseMessage
  }

  return 'Posta AI is warming up. Please try again.'
}

export const useAiChatStore = defineStore('aiChat', {
  state: () => ({
    isOpen: false,
    isLoading: false,
    messages: [
      {
        id: createMessageId(),
        role: 'assistant' as AiChatMessageRole,
        content: 'Hi, I am Posta Mitra. Ask me to find records.'
      }
    ] as AiChatMessage[]
  }),
  actions: {
    toggleChat() {
      this.isOpen = !this.isOpen
    },
    openChat() {
      this.isOpen = true
    },
    closeChat() {
      this.isOpen = false
    },
    async sendMessage(message: string) {
      const trimmedMessage = message.trim()
      if (!trimmedMessage || this.isLoading) {
        return
      }

      this.messages.push({
        id: createMessageId(),
        role: 'user',
        content: trimmedMessage
      })

      this.isLoading = true

      try {
        const response = await axios.post<AiChatResponse>(baseUrl, {
          message: trimmedMessage
        })
        const records = response.data.records ?? []

        this.messages.push({
          id: createMessageId(),
          role: response.data.role || 'assistant',
          content: response.data.answer || 'I found a response, but it did not include an answer.',
          records
        })
      } catch (error) {
        console.error('AI chat request failed:', error)
        this.messages.push({
          id: createMessageId(),
          role: 'assistant',
          content: getAiChatErrorMessage(error)
        })
      } finally {
        this.isLoading = false
      }
    }
  }
})
