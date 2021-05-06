import './App.css';
import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AppBar,
  Avatar,
  Chip,
  Button,
  Toolbar
} from '@material-ui/core';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import FilterHeaders from './components/filterHeaders';
import useStyles from './components/styles';

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
    warning: {
      main: '#9a0036',
      contrastText: '#fff'
    }
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
    MuiChip: {
      root: {
        margin: 4,
      }
    },
    MuiButton: {
      root: {
        minWidth: 100,
        textTransform: 'none',
        padding: '4px 0px',
        fontSize: '1em',
        margin: '4px',
        color: '#000',
        backgroundColor: '#FFED94'
      },
      containedSecondary: {
        color: '#fff',
        backgroundColor: '#9a0036'
      }
    },
    PrivateSwitchBase: {
      root: {
        padding: 4
      }
    },
    MuiInputBase: {
      root: {
        color: 'inherit',
        border: '1px solid #FFED94',
        height: 30,
        margin: '10px 0'
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 20,
        margin: '0 10px 10px 10px'
      }
    }
  },
});

const config = {
  webserver: 'https://dev-reports.umusic.net',
  projectID: '9F6387B5461149B8B8EBC0B160B3BAFD',
  dossierID: '33A5DAB84733B12111B15CA2BBCC88C5',
  username: 'Administrator',
  password: 'asdf&890'
}

const baseRestURL = config.webserver + "/MicroStrategyLibrary";
const projectUrl = baseRestURL + '/app/' + config.projectID;
const dossierURL = projectUrl + '/' + config.dossierID;

const loginOptions = {
  method: 'POST',
  credentials: 'include', //include cookie
  mode: 'cors', //set as CORS mode for cross origin resource sharing
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
      "loginMode": 1, // 
      // "loginMode": 1, // standard login mode
      // // "loginMode": 8, // Login as guest user
      "username": config.username,
      "password": config.password
  })
};

const getAuthToken = () => {
  return fetch(baseRestURL + '/api/auth/login', loginOptions).then((response) => {
      if (response.ok) {
          return response.headers.get('x-mstr-authToken');
      } else if (response.status === 401) {
          // try again
          return getAuthToken();
      } else {
          response.json().then((json) => {
              console.log(json);
          });
      }
  }).catch((error) => {
      console.log(error);
  });
};

function App() {
  const classes = useStyles();

  const [selected, setSelected] = useState([]);
  const [token, setToken] = useState();
  const [filters, setFilters] = useState([]);
  const [embDossier, setEmbDossier] = useState();
  const [filterIndexMap, setFilterIndexMap] = useState({});
  const [isPopupFilterOpen, setIsPopupFilterOpen] = useState(false);
  
  const update = (modified) => {
    // console.log(modified);

    let temp = [];
    for (const key in modified) {
      const sel = modified[key].filterDetail.items.filter(item => item.selected).map(item => ({
        name: item.name,
        value: item.value,
        key
      }));

      temp = [...temp, ...sel];
    }

    setSelected(temp);
  }

  const handleDelete = (data) => {
    console.log('handleDelete');
    console.log(data);
    const clone = filters;

    for (const f of clone) {
      if (f.filterKey === data.key) {
        for (const item of f.filterDetail.items) {
          if (item.name === data.name) {
            item.selected = false;
            break;
          }
        }
      }
    }
    const filterMap = clone.reduce((acc, filterObj) => {
        acc[filterObj.filterKey] = filterObj;
        return acc;
    }, {})

    setFilters(clone);
    update(filterMap);
  }

  const applyFilters = (e) => {
    console.log('Applying filters', selected);

    if (selected.length > 0) {
      const filterKeyMap = selected.reduce((acc, selection) => {
        if(acc[selection.key]) {
          acc[selection.key].push(selection);
        } else {
          acc[selection.key] = [selection];
        }
        return acc;
      }, {});
  
      // console.log(filterKeyMap);
  
      for (const filterKey of Object.keys(filterKeyMap)) {
        const filterDataObj = {};
        const filterInfoObj = { key: filterKey};
        const selectionsObj = filterKeyMap[filterKey].map(selection => ({ value: selection.value}));
        filterDataObj.selections = selectionsObj;
        filterDataObj.filterInfo = filterInfoObj;
        filterDataObj.holdSubmit = true;
        console.log(filterDataObj);
        embDossier.filterSelectMultiAttributes(filterDataObj);
      }
  
      embDossier.filterApplyAll();  
    } else {
      embDossier.filterClearAll();
    }

    
  }

  const clearAll = (e) => {
    setSelected([]);
    const clone = filters;

    for (const f of clone) {
      for (const item of f.filterDetail.items) {
        item.selected = false;
      }
    }
    setFilters(clone);
    embDossier.filterClearAll();
  }

  const populateDossiers = (token) => {
    window.microstrategy.dossier.create({
      // This is the document's <div> container where the Dossier should be placed.
      placeholder: document.getElementById("dossierContainer"),
      url: dossierURL,

      // The following parameters define the appearance of the Dossier.
      // E.g. is the navigation or collaboration bar displayed, do right-click actions work, etc.
      disableNotification: true,
      filterFeature: {
          enabled: true,
          edit: true,
          summary: false
      },
      dossierFeature: {
          readonly: true
      },
      shareFeature: {
          enabled: true,
          invite: false,
          link: false,
          email: false,
          export: false,
          download: false
      },
      enableCollaboration: false,
      dockedComment: {
          dockedPosition: "right",
          canClose: false,
          dockChangeable: false,
          isDocked: true
      },
      enableResponsive: true,
      // And finally the necessary parameters for the user authentication
      enableCustomAuthentication: true,
      customAuthenticationType: window.microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
      getLoginToken: () => { return Promise.resolve(token) }
    }).then(function (dossier) {
        // after the Dossier has finished loading...
        // get hook to dossier
        let embedded_dossier = dossier;
        setEmbDossier(embedded_dossier);

        // get list of all filters
        embedded_dossier.getFilterList().then(function (filterList) {
          console.log('filterList', filterList);
          setFilters(filterList);

          const preselected = [];
          let counter = 0;
          const map = {};
          for(const fl of filterList) {
            map[fl.filterKey] = counter;
            counter += 1;
            for (const itemsfl of fl.filterDetail.items) {
              if (itemsfl.selected) {
                preselected.push({
                  name: itemsfl.name,
                  value: itemsfl.value,
                  key: fl.filterKey
                })
              }
            }
          }
          setFilterIndexMap(map);
          setSelected(preselected);
        });
    });
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://dev-reports.umusic.net/MicroStrategyLibrary/javascript/embeddinglib.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      // console.log('Token is missing');
      getAuthToken().then((tkn) => {
        // console.log('got token: ' + tkn);
        setToken(tkn);
      }).catch((error) => {
          console.log(error);
      });
    } else {
      populateDossiers(token);
    }
  }, [token]);
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <div className="logo-container">
              <img className={classes.imageIcon} src="/UMG-logo2.png" alt="logo" />   
            </div>
            <div>
            <h1>Royalty Analytics</h1>
            </div>
            <div className="profile">
                <Avatar className={classes.avatarIcon} variant="circular">BG</Avatar>
            </div>
          </Toolbar>

          <div className="centered"> 
            <div className="filter box">
              <div className="attributes-container box">
                <div className="selected-attributes box">
                  {Boolean(selected.length) && selected.map(s => (
                    <Chip key={`${s.key}-${s.name}`} label={s.name} onDelete={e => handleDelete(s)}
                      classes={{
                        colorSecondary: classes[`color-${filterIndexMap[s.key]}-bgColor`]
                      }}
                      color="secondary" />
                  ))}
                </div>
                <div className="actions box">
                  {Boolean(selected.length) && <Button component="div" variant="contained" color="secondary" onClick={clearAll}>Clear Filters</Button>}
                  <Button component="div" variant="contained" disabled={isPopupFilterOpen} onClick={applyFilters}>Apply</Button>
                </div>
              </div>
              <div className="filter-headers box">
                <FilterHeaders isOpen={setIsPopupFilterOpen} filters={filters} update={update}/>
              </div>
            </div>
          </div>
        </AppBar>
        <div className="App-body">
          <div className="centered"> 
            <div className="dossier box" id="dossierContainer">
            </div>
          </div>
        </div>
      </div>
    </MuiThemeProvider>
    
  );
}

export default App;
