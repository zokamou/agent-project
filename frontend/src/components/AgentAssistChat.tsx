import { useState } from 'react'
import {
  Alert,
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type {
  AssistResponse,
  ChatMessage,
  ChatRole,
  RequestStatus,
} from '../types/ChatTypes'
import { chatThemeTokens } from '../theme'
import { AgentChatMessage } from './AgentChatMessage'
import { ChatInput } from './ChatInput'
import { UserChatMessage } from './UserChatMessage'

const createMessage = (role: ChatRole, text: string): ChatMessage => ({
  id: `${role}-${crypto.randomUUID()}`,
  role,
  text,
})

const initialMessages: ChatMessage[] = [
  createMessage(
    'agent',
    'Hi there! Ask me anything and I will send it to the backend for a reply.'
  ),
]

export const AgentAssistChat = () => {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [status, setStatus] = useState<RequestStatus>('idle')

  const handleSubmit = async () => {
    const trimmedDraft = draft.trim()

    if (!trimmedDraft || status === 'submitting') {
      return
    }

    const userMessage = createMessage('user', trimmedDraft)

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setDraft('')
    setStatus('submitting')

    try {
      const response = await fetch('/api/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmedDraft }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as AssistResponse

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage('agent', data.message),
      ])
      setStatus('idle')
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          'agent',
          'Something went wrong reaching the assistant. Please try again in a moment.'
        ),
      ])
      setStatus('error')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
        background: chatThemeTokens.pageBackground,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 920,
          minHeight: 'calc(100vh - 48px)',
          mx: 'auto',
          p: { xs: 2.5, sm: 4 },
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          border: `1px solid ${chatThemeTokens.shellBorder}`,
          backgroundColor: chatThemeTokens.shellBackground,
          boxShadow: chatThemeTokens.shellShadow,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: 'secondary.main',
              letterSpacing: '0.16em',
              fontWeight: 700,
            }}
          >
            Agent Assist
          </Typography>
          <Typography
            variant="h3"
            sx={{
              mt: 0.5,
              fontSize: { xs: '2rem', sm: '2.8rem' },
              lineHeight: 1.05,
              color: 'text.primary',
              fontWeight: 700,
            }}
          >
            Friendly chat, simple backend.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1.25,
              maxWidth: 560,
              color: 'text.secondary',
            }}
          >
            Type a message, send it to the prototype endpoint, and see the reply
            appear in the conversation.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            borderRadius: 1,
            border: `1px solid ${chatThemeTokens.transcriptBorder}`,
            backgroundColor: chatThemeTokens.transcriptBackground,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={2.25}>
            {messages.map((message) =>
              message.role === 'user' ? (
                <UserChatMessage key={message.id} message={message.text} />
              ) : (
                <AgentChatMessage key={message.id} message={message.text} />
              )
            )}
          </Stack>
        </Paper>

        {status === 'error' ? (
          <Alert
            severity="warning"
            sx={{
              borderRadius: 1,
              backgroundColor: 'warning.light',
            }}
          >
            The last request did not complete, but your conversation is still
            here and you can try again.
          </Alert>
        ) : null}

        <ChatInput
          value={draft}
          onChange={setDraft}
          onSubmit={handleSubmit}
          isSubmitting={status === 'submitting'}
        />
      </Paper>
    </Box>
  )
}
