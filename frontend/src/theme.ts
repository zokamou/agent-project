import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ee8faf',
      light: '#f6afc6',
      dark: '#da728d',
      contrastText: '#fff7fb',
    },
    secondary: {
      main: '#b25f82',
      light: '#ffd7e6',
      dark: '#8f4566',
      contrastText: '#fff7fb',
    },
    background: {
      default: '#fff7f4',
      paper: '#fffafc',
    },
    text: {
      primary: '#42293a',
      secondary: '#6d5260',
    },
    warning: {
      main: '#d78b38',
      light: '#fff4e8',
      dark: '#9e5f18',
    },
    divider: '#e7c6d3',
  },
  shape: {
    borderRadius: 3,
  },
  typography: {
    fontFamily: '"Avenir Next", "Nunito", "Trebuchet MS", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: 'none',
        },
      },
    },
  },
})

export const chatThemeTokens = {
  pageBackground: '#fff7f4',
  shellBackground: '#fffafc',
  shellBorder: '#edd2dc',
  shellShadow: '0 18px 40px rgba(143, 69, 102, 0.10)',
  transcriptBackground: '#fffdfd',
  transcriptBorder: '#f3d9e4',
  agentBubbleBackground: '#fff0f6',
  agentBubbleBorder: '#ecc8d8',
  composerBackground: '#fffafc',
  composerBorder: '#f0d6e1',
  userBubbleBackground: '#ee8faf',
  sendButtonBackground: '#ee8faf',
} as const
