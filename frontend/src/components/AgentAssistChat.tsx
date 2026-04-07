import {
  Box,
  Button,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import type { AgentAssistChatProps } from '../types/ChatTypes'
import { AgentChatMessage } from './AgentChatMessage'
import { ChatInput } from './ChatInput'
import { UserChatMessage } from './UserChatMessage'

export const AgentAssistChat = ({
  draft,
  nextSpeaker,
  messages,
  onDraftChange,
  onNextSpeakerChange,
  onClearConversation,
  onSubmit,
  status,
}: AgentAssistChatProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        height: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          height: '100%',
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: 'secondary.main',
              letterSpacing: '0.16em',
              fontWeight: 700,
            }}
          >
            Conversation
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={onClearConversation}
            disabled={status === 'submitting'}
          >
            Start new chat
          </Button>
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
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}
              >
                Send the next message as
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={nextSpeaker}
                onChange={(_, value) => {
                  if (value) {
                    onNextSpeakerChange(value)
                  }
                }}
                sx={{ gap: 1 }}
              >
                <ToggleButton value="tenant" disabled={status === 'submitting'}>
                  Tenant
                </ToggleButton>
                <ToggleButton value="employee" disabled={status === 'submitting'}>
                  Employee
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <ChatInput
              id="conversation-message-input"
              placeholder={
                nextSpeaker === 'tenant'
                  ? "Type the tenant's next message..."
                  : 'Type the employee reply...'
              }
              submitLabel='send'
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
