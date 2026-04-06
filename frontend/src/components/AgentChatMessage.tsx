import { Avatar, Box, Paper, Typography } from '@mui/material'

type AgentChatMessageProps = {
  message: string
}

export const AgentChatMessage = ({ message }: AgentChatMessageProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: 'warning.light',
          color: 'primary.main',
          fontWeight: 700,
        }}
      >
        A
      </Avatar>
      <Box sx={{ maxWidth: { xs: '88%', sm: '78%' } }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.75,
            color: 'primary.main',
            fontWeight: 700,
          }}
        >
          Agent
        </Typography>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: '22px 22px 22px 8px',
            backgroundColor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
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
