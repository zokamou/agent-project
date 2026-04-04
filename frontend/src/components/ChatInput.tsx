import type { KeyboardEvent } from 'react'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { chatThemeTokens } from '../theme'
import type { ChatInputProps } from '../types/ChatTypes'

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: ChatInputProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 1,
        border: `1px solid ${chatThemeTokens.composerBorder}`,
        backgroundColor: chatThemeTokens.composerBackground,
      }}
    >
      <Typography
        component="label"
        htmlFor="agent-assist-input"
        sx={{ display: 'block', mb: 1.25, color: 'text.secondary', fontWeight: 600 }}
      >
        Your message
      </Typography>

      <TextField
        id="agent-assist-input"
        fullWidth
        multiline
        minRows={3}
        maxRows={8}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        placeholder="Ask the backend something nice..."
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            alignItems: 'flex-start',
            borderRadius: .5,
            backgroundColor: 'common.white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'secondary.main',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        }}
      />

      <Box
        sx={{
          mt: 1.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 1.25,
        }}
      >

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || value.trim().length === 0}
          sx={{
            minWidth: 140,
            alignSelf: { xs: 'flex-end', sm: 'auto' },
            px: 3,
            py: 1.1,
            backgroundColor: chatThemeTokens.sendButtonBackground,
          }}
          startIcon={
            isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {isSubmitting ? 'Sending...' : 'Send message'}
        </Button>
      </Box>
    </Box>
  )
}
