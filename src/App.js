import './App.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AppBar,
  IconButton,
  Tabs, Tab,
  Toolbar
} from '@material-ui/core';

// Create your Own theme:
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
      contrastText: '#FFED94'
    },
    secondary: {
      main: '#E7E7E7',
      contrastText: '#1C365A'
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#000',
        },
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: 22,
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 12,
      },
      adornedStart: {
        borderRadius: 22,
      }
    }
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="fixed">
          UMG
        </AppBar>UMG
      </div>
    </MuiThemeProvider>
    
  );
}

export default App;
