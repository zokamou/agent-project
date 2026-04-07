import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material'
import type { AgentAssistDataDisplayProps } from '../types/ChatTypes'

export const AgentAssistDataDisplay = ({
  analysis,
  status,
  onDraftChange
}: AgentAssistDataDisplayProps) => {

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
          minHeight: 'calc(100vh - 48px)',
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
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignContent: 'center', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.primary', fontWeight: 700 }}
          >
            Suggested reply
          </Typography>
          <Button 
            sx={{border: '1px solid', borderColor: 'primary.main', px: 2}}
            size="small" 
            onClick={() => onDraftChange(analysis?.suggestedReply ?? '')} disabled={!analysis?.suggestedReply || status === 'submitting'}>
            <Typography>
              Use suggested reply
            </Typography>
          </Button>
          </Box>
          <Typography sx={{ mt: 2, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
            {status === 'submitting'
              ? 'Analyzing...'
              : analysis?.suggestedReply}
          </Typography>
          <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
            {analysis?.usedSources && status !== 'submitting' ? `Used sources: ${analysis.usedSources}` : ''}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700 }}>
            Top matches
          </Typography>
          {status === 'submitting' ? (
            <Typography sx={{ color: 'text.secondary' }}>
              Analyzing...
            </Typography>
          ) : analysis?.matchedItems?.length ? (
            analysis.matchedItems.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                  {item.category}
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>
                  {item.content}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              No direct matches yet.
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignContent: 'center', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.primary', fontWeight: 700 }}>
              Related categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {status === 'submitting' ? (
                <Typography sx={{ color: 'text.secondary' }}>
                  Analyzing...
                </Typography>
              ) : analysis?.relatedCategories?.length ? (
                analysis.relatedCategories.map((category) => (
                  <Chip key={category} label={category} color="secondary" variant="outlined" />
                ))
              ) : null}
            </Box>
          </Box>

          {status === 'submitting' ? (
            <Typography sx={{ color: 'text.secondary' }}>
              Analyzing...
            </Typography>
          ) : analysis?.relatedItems?.length ? (
            analysis.relatedItems.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                  {item.category}
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.primary' }}>
                  {item.content}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              No related policy details yet.
            </Typography>
          )}
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
