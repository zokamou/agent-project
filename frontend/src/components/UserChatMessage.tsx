import { Box, Paper, Typography } from '@mui/material'
import { chatThemeTokens } from '../theme'

type UserChatMessageProps = {
  message: string
}

export const UserChatMessage = ({ message }: UserChatMessageProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box sx={{ maxWidth: { xs: '90%', sm: '74%' } }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.75,
            textAlign: 'right',
            color: 'secondary.main',
            fontWeight: 700,
          }}
        >
          You
        </Typography>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: '22px 22px 8px 22px',
            backgroundColor: chatThemeTokens.userBubbleBackground,
            color: 'primary.contrastText',
          }}
        >
          <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {message}
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}
