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
      main: '#FFED94',
      contrastText: '#000'
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
    MuiCheckbox: {
      root: {
        color: '#FFED94'
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
    {
      name: 'Genre',
      selectMultiple: true,
      items: [
        {
          name: 'Alternative',
          selected: false
        },
        {
          name: 'Brazilian',
          selected: false
        },
        {
          name: 'Blues',
          selected: false
        },
        {
          name: 'German Pop',
          selected: false
        }
      ]
    },
    {
      name: 'Listener Country',
      selectMultiple: true,
      items: [
        {
          name: 'India',
          selected: false
        },
        {
          name: 'Japan',
          selected: false
        },
        {
          name: 'Brazil',
          selected: false
        },
        {
          name: 'France',
          selected: false
        }
      ]
    },
    {
      name: 'Distributor',
      selectMultiple: true,
      items: [
        {
          name: 'Record Union',
          selected: false
        },
        {
          name: 'CD Baby',
          selected: false
        },
        {
          name: 'Ditto',
          selected: false
        },
        {
          name: 'Finetunes',
          selected: false
        }
      ]
    },
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
