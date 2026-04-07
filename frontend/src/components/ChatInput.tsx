import type { KeyboardEvent } from 'react'
import { Box, Button, CircularProgress, TextField } from '@mui/material'
import type { ChatInputProps } from '../types/ChatTypes'

export const ChatInput = ({
  id,
  placeholder,
  submitLabel,
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
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        p: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
      }}
    >
      <TextField
        id={id}
        fullWidth
        multiline
        minRows={1}
        maxRows={8}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        placeholder={placeholder}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            alignItems: 'flex-start',
            borderRadius: 3,
            backgroundColor: 'background.default',
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

      <Button
        type="submit"
        disabled={isSubmitting || value.trim().length === 0}
        sx={{
          px: 3,
          py: 1.1,
          height: { xs: 'auto', sm: 44 },
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        startIcon={
          isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {isSubmitting ? 'Sending...' : submitLabel}
      </Button>
    </Box>
  )
}
