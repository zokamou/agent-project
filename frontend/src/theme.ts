import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f47202',
      light: '#febd61',
      dark: '#e92300',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e92300',
      light: '#f7b9b1',
      dark: '#f17b6b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fef2eb',
      paper: '#ffffff',
    },
    text: {
      primary: '#42293a',
      secondary: '#6d5260',
    },
    warning: {
      main: '#ffa900',
      light: '#fdd6b1',
      dark: '#f47202',
    },
    divider: '#f7b9b1',
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
