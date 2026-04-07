import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { AgentAssistChat } from '../components/AgentAssistChat'
import { AgentAssistDataDisplay } from '../components/AgentAssistDataDisplay'
import type {
  AssistResponse,
  AssistantAnalysis,
  ChatMessage,
  ComposerRole,
  ConversationResponse,
  ConversationMessage,
  EmployeeMessageResponse,
  RequestStatus,
} from '../types/ChatTypes'

const mapConversationToChatMessages = (
  conversation: ConversationMessage[]
): ChatMessage[] => {
  const mappedMessages: ChatMessage[] = []

  for (const message of conversation) {
    mappedMessages.push({
      id: message.id ?? crypto.randomUUID(),
      role: message.role === 'tenant' ? 'user' : 'agent',
      text: message.text,
    })
  }

  return mappedMessages
}

export const AgentAssistPage = () => {
  const [draft, setDraft] = useState('')
  const [nextSpeaker, setNextSpeaker] = useState<ComposerRole>('tenant')
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [assistantAnalysis, setAssistantAnalysis] =
    useState<AssistantAnalysis | null>(null)

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const response = await fetch('/api/messages')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as ConversationResponse
        setMessages(mapConversationToChatMessages(data.conversation))
      } catch {
        setMessages([])
      }
    }

    void loadConversation()
  }, [])

  const requestAssistAnalysis = async (tenantMessage: string) => {
    if (!tenantMessage.trim() || status === 'submitting') {
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/tenant-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latestTenantMessage: tenantMessage }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as AssistResponse
      setMessages(mapConversationToChatMessages(data.conversation))
      setAssistantAnalysis(data)
      setStatus('idle')
    } catch {
      setAssistantAnalysis({
        question: tenantMessage,
        message: 'Something went wrong reaching the assistant.',
        conversationSummary:
          'The assistant could not analyze the latest tenant message.',
        suggestedReply:
          'Thanks for your patience while I look into that for you.',
        matchedItems: [],
        relatedItems: [],
        relatedCategories: [],
      })
      setStatus('error')
    }
  }

  const handleTenantMessage = async () => {
    const tenantMessage = draft.trim()

    if (!tenantMessage) {
      return
    }

    await requestAssistAnalysis(tenantMessage)
    setDraft('')
    setNextSpeaker('employee')
  }

  const handleEmployeeReply = async () => {
    const employeeMessage = draft.trim()

    if (!employeeMessage || status === 'submitting') {
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/employee-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: employeeMessage }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as EmployeeMessageResponse
      setMessages(mapConversationToChatMessages(data.conversation))
      setDraft('')
      setNextSpeaker('tenant')
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  const handleSubmit = async () => {
    if (nextSpeaker === 'tenant') {
      await handleTenantMessage()
      return
    }

    await handleEmployeeReply()
  }

  const handleClearConversation = async () => {
    if (status === 'submitting') {
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/clear-messages', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as ConversationResponse
      setMessages(mapConversationToChatMessages(data.conversation))
      setAssistantAnalysis(null)
      setDraft('')
      setNextSpeaker('tenant')
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        gap: 3,
        p: 3,
      }}
    >
      <Box sx={{ width: '40%', flexShrink: 0, minWidth: 0, height: '100%' }}>
        <AgentAssistChat
          draft={draft}
          nextSpeaker={nextSpeaker}
        messages={messages}
        onDraftChange={setDraft}
        onNextSpeakerChange={setNextSpeaker}
        onClearConversation={handleClearConversation}
        onSubmit={handleSubmit}
        status={status}
      />
      </Box>
      <Box sx={{ width: '60%', flexShrink: 0, minWidth: 0, height: '100%' }}>
        <AgentAssistDataDisplay
          analysis={assistantAnalysis}
          status={status}
          onDraftChange={(value) => {
            setDraft(value)
            setNextSpeaker('employee')
          }}
        />
      </Box>
    </Box>
  )
}
