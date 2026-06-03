<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MessageCircleIcon, RobotIcon, SendIcon, XIcon } from 'vue-tabler-icons'
import { useAiChatStore, type AiChatRecordResult } from '@/stores/aiChat'

const aiChatStore = useAiChatStore()
const router = useRouter()
const draftMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const starterPrompts = [
  'Show completed records',
  'Find records from Pampadumpara',
  'Find people living abroad',
  'Show records with redirected address'
]

const assistantName = 'Posta Mitra'
const markdownRenderer = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

const canSend = computed(() => draftMessage.value.trim().length > 0 && !aiChatStore.isLoading)

watch(
  () => aiChatStore.messages.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
)

const sendMessage = async () => {
  if (!canSend.value) {
    return
  }

  const message = draftMessage.value
  draftMessage.value = ''
  await aiChatStore.sendMessage(message)
}

const sendStarterPrompt = async (prompt: string) => {
  draftMessage.value = prompt
  await sendMessage()
}

const getRecordName = (record: AiChatRecordResult) => {
  const name = [record.firstName, record.lastName].filter(Boolean).join(' ')
  return name || `Record #${record.id}`
}

const getRecordLocation = (record: AiChatRecordResult) =>
  [record.village, record.panchayat, record.district].filter(Boolean).join(', ')

const renderAssistantMarkdown = (content: string) => markdownRenderer.render(content)

const openRecord = (recordId?: string) => {
  if (!recordId) {
    return
  }

  aiChatStore.closeChat()
  router.push(`/edit/record/${recordId}`)
}
</script>

<template>
  <div class="ai-chat-widget">
    <v-slide-y-reverse-transition>
      <v-card v-if="aiChatStore.isOpen" class="ai-chat-panel" elevation="12">
        <v-card-title class="ai-chat-header">
          <div class="d-flex align-center ga-2">
            <v-avatar color="secondary" size="34">
              <RobotIcon size="20" />
            </v-avatar>
            <div>
              <div class="text-h5">{{ assistantName }}</div>
              <div class="text-caption text-medium-emphasis">Ask me to find records.</div>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="aiChatStore.closeChat">
            <XIcon size="18" />
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text ref="messagesContainer" class="ai-chat-messages">
          <div
            v-for="message in aiChatStore.messages"
            :key="message.id"
            class="ai-chat-message"
            :class="message.role === 'user' ? 'ai-chat-message-user' : 'ai-chat-message-assistant'"
          >
            <div v-if="message.role === 'assistant'" class="ai-chat-ai-label">
              <RobotIcon size="13" />
              <span>{{ assistantName }} · AI</span>
            </div>
            <div
              v-if="message.role === 'assistant'"
              class="ai-chat-bubble ai-chat-markdown"
              v-html="renderAssistantMarkdown(message.content)"
            />
            <div v-else class="ai-chat-bubble">
              {{ message.content }}
            </div>

            <div v-if="message.records?.length" class="ai-chat-records">
              <v-card
                v-for="record in message.records"
                :key="record.id"
                class="ai-chat-record-card"
                variant="outlined"
              >
                <div class="d-flex justify-space-between align-start ga-2">
                  <div>
                    <div class="text-subtitle-2">{{ getRecordName(record) }}</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ record.email || record.mobileNumber || 'No contact saved' }}
                    </div>
                    <div v-if="getRecordLocation(record)" class="text-caption text-medium-emphasis">
                      {{ getRecordLocation(record) }}
                    </div>
                  </div>
                  <v-chip v-if="record.status" size="x-small" color="secondary" variant="tonal">
                    {{ record.status }}
                  </v-chip>
                </div>
                <v-btn
                  class="mt-2"
                  size="small"
                  color="secondary"
                  variant="text"
                  :disabled="!record.id"
                  @click="openRecord(record.id)"
                >
                  Open record
                </v-btn>
              </v-card>

            </div>
          </div>

          <div v-if="aiChatStore.messages.length === 1" class="ai-chat-prompts">
            <v-chip
              v-for="prompt in starterPrompts"
              :key="prompt"
              size="small"
              color="secondary"
              variant="tonal"
              :disabled="aiChatStore.isLoading"
              @click="sendStarterPrompt(prompt)"
            >
              {{ prompt }}
            </v-chip>
          </div>

          <div v-if="aiChatStore.isLoading" class="ai-chat-message ai-chat-message-assistant">
            <div class="ai-chat-ai-label">
              <RobotIcon size="13" />
              <span>{{ assistantName }} · AI</span>
            </div>
            <div class="ai-chat-bubble">
              <v-progress-circular indeterminate size="16" width="2" color="secondary" class="mr-2" />
              Thinking...
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="ai-chat-input">
          <v-text-field
            v-model="draftMessage"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="Ask to find records..."
            :disabled="aiChatStore.isLoading"
            @keyup.enter="sendMessage"
          />
          <v-btn icon color="secondary" variant="flat" :disabled="!canSend" @click="sendMessage">
            <SendIcon size="18" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>

    <v-btn class="ai-chat-button" color="secondary" size="large" elevation="10" @click="aiChatStore.toggleChat">
      <div v-if="!aiChatStore.isOpen" class="ai-chat-button-content">
        <MessageCircleIcon size="22" />
        <span>AI</span>
      </div>
      <XIcon v-else size="24" />
    </v-btn>
  </div>
</template>

<style scoped>
.ai-chat-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1005;
}

.ai-chat-panel {
  width: min(380px, calc(100vw - 32px));
  max-height: min(620px, calc(100vh - 112px));
  margin-bottom: 16px;
  border-radius: 18px;
  overflow: hidden;
}

.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.ai-chat-messages {
  height: 390px;
  overflow-y: auto;
  padding: 16px;
  background: rgb(var(--v-theme-containerBg));
}

.ai-chat-message {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.ai-chat-message-user {
  align-items: flex-end;
}

.ai-chat-message-assistant {
  align-items: flex-start;
}

.ai-chat-ai-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0 0 4px 2px;
  color: rgb(var(--v-theme-secondary));
  font-size: 0.7rem;
  font-weight: 600;
}

.ai-chat-bubble {
  max-width: 86%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 0.875rem;
  line-height: 1.45;
  white-space: pre-wrap;
}

.ai-chat-message-user .ai-chat-bubble {
  color: white;
  background: rgb(var(--v-theme-secondary));
  border-bottom-right-radius: 4px;
}

.ai-chat-message-assistant .ai-chat-bubble {
  background: white;
  border-bottom-left-radius: 4px;
}

.ai-chat-markdown {
  white-space: normal;
}

.ai-chat-markdown :deep(p) {
  margin: 0 0 8px;
}

.ai-chat-markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.ai-chat-markdown :deep(ul),
.ai-chat-markdown :deep(ol) {
  margin: 0 0 8px 18px;
  padding: 0;
}

.ai-chat-markdown :deep(strong) {
  font-weight: 700;
}

.ai-chat-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.ai-chat-records {
  width: 100%;
  max-width: 92%;
  margin-top: 8px;
}

.ai-chat-record-card {
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: white;
}

.ai-chat-input {
  gap: 8px;
  padding: 12px;
}

.ai-chat-button {
  float: right;
  min-width: 72px;
  height: 52px;
  border-radius: 999px;
}

.ai-chat-button-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

@media (max-width: 600px) {
  .ai-chat-widget {
    right: 16px;
    bottom: 16px;
  }

  .ai-chat-messages {
    height: 340px;
  }
}
</style>
