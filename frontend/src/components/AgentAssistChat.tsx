import {
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { AgentAssistChatProps } from '../types/ChatTypes'
import { AgentChatMessage } from './AgentChatMessage'
import { ChatInput } from './ChatInput'
import { UserChatMessage } from './UserChatMessage'
export const AgentAssistChat = ({
  draft,
  messages,
  onDraftChange,
  onSubmit,
  status,
}: AgentAssistChatProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 920,
          minHeight: 'calc(100vh - 48px)',
          mx: 'auto',
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
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
            Chat
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
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              maxHeight: '58vh',
              overflowY: 'auto',
              px: { xs: 2, sm: 3 },
              pt: { xs: 2, sm: 3 },
              pb: { xs: 1.5, sm: 2 },
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
          </Box>

          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              px: { xs: 1.25, sm: 2 },
              py: { xs: 1.25, sm: 1.5 },
              backgroundColor: 'background.paper',
            }}
          >
            <ChatInput
              value={draft}
              onChange={onDraftChange}
              onSubmit={onSubmit}
              isSubmitting={status === 'submitting'}
            />
          </Box>
        </Paper>
      </Paper>
    </Box>
  )
}
