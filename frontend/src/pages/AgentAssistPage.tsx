import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { AgentAssistChat } from '../components/AgentAssistChat'
import { AgentAssistDataDisplay } from '../components/AgentAssistDataDisplay'
import type {
  AssistResponse,
  AssistantAnalysis,
  ChatMessage,
  ChatRole,
  RequestStatus,
} from '../types/ChatTypes'

const potentialMessages: string[] = [
  'I need help getting into my storage unit.',
  'Can you tell me how to reset my password?',
  'Is anyone on site right now to help me?',
  'What are your hours of operation?',
  'Can I get a copy of my last invoice?',
]

const initialTenantMessage =
  potentialMessages[Math.floor(Math.random() * potentialMessages.length)]

const createMessage = (role: ChatRole, text: string): ChatMessage => ({
  id: `${role}-${crypto.randomUUID()}`,
  role,
  text,
})

export const AgentAssistPage = () => {
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [assistantAnalysis, setAssistantAnalysis] = useState<AssistantAnalysis | null>(
    null
  )
  const hasRequestedInitialAnalysis = useRef(false)

  const requestAssistAnalysis = async (tenantMessage: string) => {
    if (!tenantMessage.trim() || status === 'submitting') {
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: tenantMessage }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as AssistResponse
      setAssistantAnalysis(data)
      setStatus('idle')
    } catch {
      setAssistantAnalysis({
        question: tenantMessage,
        message: 'Something went wrong reaching the assistant.',
        conversationSummary: 'The assistant could not analyze the latest tenant message.',
        suggestedReply: 'Thanks for your patience while I look into that for you.',
      })
      setStatus('error')
    }
  }

  const handleTenantMessage = async (
    tenantMessage: string,
    options?: { appendToMessages?: boolean }
  ) => {
    const trimmedMessage = tenantMessage.trim()

    if (!trimmedMessage) {
      return
    }

    if (options?.appendToMessages !== false) {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage('user', trimmedMessage),
      ])
    }

    await requestAssistAnalysis(trimmedMessage)
  }

  const requestInitialTenantAnalysis = useEffectEvent(async () => {
    await handleTenantMessage(initialTenantMessage)
  })

  useEffect(() => {
    if (hasRequestedInitialAnalysis.current) {
      return
    }

    hasRequestedInitialAnalysis.current = true
    void requestInitialTenantAnalysis()
  }, [])

  const handleEmployeeReply = () => {
    const trimmedDraft = draft.trim()

    if (!trimmedDraft || status === 'submitting') {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage('agent', trimmedDraft),
    ])
    setDraft('')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', p: 3, gap: 3 }}>
      <AgentAssistChat
        draft={draft}
        messages={messages}
        onDraftChange={setDraft}
        onSubmit={handleEmployeeReply}
        status={status}
      />
      <AgentAssistDataDisplay analysis={assistantAnalysis} status={status} onDraftChange={setDraft} />
    </Box>
  )
}
