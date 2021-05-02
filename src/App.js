import './App.css';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AppBar,
  Avatar,
  IconButton,
  Tabs, Tab,
  Toolbar
} from '@material-ui/core';
import FilterHeaders from './components/filterHeaders';

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
    MuiAppBar: {
      positionFixed: {
        minHeight: 62,
        border: '1px solid salmon',
        padding: '5px 0',
      }
    },
    MuiToolbar: {
      root: {
        justifyContent: 'space-between'
      }
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

const useStyles = makeStyles((theme) => ({
  imageIcon: {
    height: 42,
  },
  avatarIcon: {
    color: '#FFED94',
    backgroundColor: '#000',
    border: '4px solid #FFED94'
  },
}));

function App() {
  const classes = useStyles(theme);

  const filters = [
    {name: 'Genre'},
    {name: 'Listener Country'}
  ];
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <div className="logo-container">
              <img className={classes.imageIcon} src="/universal-music-group-logo.png" alt="logo" />   
            </div>
            <div>
            <h1>Embedded Dossier</h1>
            </div>
            <div>
                <Avatar className={classes.avatarIcon} variant="circular">
                    BG
                </Avatar>
            </div>
        </Toolbar>
          
        </AppBar>
        <div className="App-body">
          <div className="centered"> 
            <div className="filter box">
                
              <div className="attributes-container box">
                <div className="selected-attributes box">selected-attributes</div>
                <div className="actions box">Actions</div>
              </div>
              <div className="filter-headers box">
                <FilterHeaders filters={filters} />
              </div>
            </div>
            <div className="dossier box">
                dossier box
            </div>
          </div>
        </div>
      </div>
    </MuiThemeProvider>
    
  );
}

export default App;
