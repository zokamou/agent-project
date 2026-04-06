import {
  Alert,
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material'
import type { AgentAssistDataDisplayProps } from '../types/ChatTypes'

export const AgentAssistDataDisplay = ({
  analysis,
  status,
  onDraftChange
}: AgentAssistDataDisplayProps) => {

  console.log('Rendering AgentAssistDataDisplay with analysis:', analysis, 'and status:', status)

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
            Data Retrieval, Made Easy
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1.25,
              maxWidth: 560,
              color: 'text.secondary',
            }}
          >
            All the information you need, right at your fingertips. I&apos;ll
            analyze your conversations for fast data lookup.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default',
            p: 3,
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700 }}>
            Current intent
          </Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            {analysis?.currentIntent ?? 'Waiting for a tenant message to analyze.'}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ mt: 3, color: 'text.primary', fontWeight: 700 }}
          >
            Conversation summary
          </Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            {analysis?.conversationSummary ?? 'No analysis yet.'}
          </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignContent: 'center', mt: 3 , justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            Suggested reply
          </Typography>
          <Button 
            sx={{border: '1px solid', borerColor: 'primary.main', px: 2}}
            size="small" 
            onClick={() => onDraftChange(analysis?.suggestedReply ?? '')} disabled={!analysis?.suggestedReply || status === 'submitting'}>
            <Typography>
              Use suggested reply
            </Typography>
          </Button>
          </Box>
          <Typography sx={{ mt: 2, color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
            {analysis?.suggestedReply}
          </Typography>
        </Paper>

        {status === 'error' ? (
          <Alert
            severity="warning"
            sx={{
              borderRadius: 3,
              backgroundColor: 'warning.light',
              border: '1px solid',
              borderColor: 'secondary.dark',
            }}
          >
            The assistant could not analyze the latest tenant message. Try
            again when the backend is ready.
          </Alert>
        ) : null}
      </Paper>
    </Box>
  )
}
