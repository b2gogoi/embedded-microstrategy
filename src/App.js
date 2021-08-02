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
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FilterHeaders from './components/filterHeaders';
import useStyles from './components/styles';

// Create your Own theme:
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#E5E5E5',
      contrastText: '#02C486'
    },
    secondary: {
      main: '#02C486',
      contrastText: '#FFF'
    },
    warning: {
      main: '#9a0036',
      contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: [
      'DIN OT',
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
          backgroundColor: '#E5E5E5',
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
      },
      dense: {
        minHeight: 10,
      }
    },
    MuiCheckbox: {
      /* root: {
        color: '#FFED94'
      } */
    },
    MuiChip: {
      root: {
        margin: 4,
        border: '1px solid #02C486',
        // boxSizing: 'border-box',
        // borderRadius: '5px',
        backgroundColor: 'FFFFFF',
      }
    },
    MuiButton: {
      root: {
        minWidth: 140,
        textTransform: 'uppercase',
        padding: '4px 0px',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 'bold',
        // fontWeight: 500,
        // lineHeight: '13px',
        margin: '4px',
        color: '#02C486',
        backgroundColor: '#FFED94',
        border: '2px solid #02C486',
        borderRadius: '25px',
        letterSpacing: '0.05em',
      },
      contained: {
        color: '#02C486',
        boxShadow: 'unset',
        backgroundColor: '#fff',
      },
      containedSecondary: {
        color: '#fff',
        backgroundColor: '#9a0036',
        border: 'none',
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
        border: '0px solid #C0C2C5',
        height: 30,
        margin: '10px 0',
        background: '#FCFCFC'
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 4,
        margin: '0 10px 10px 10px',
        boxSizing: 'border-box'
      }
    }
  },
});

const config = {
  webserver: 'https://dev-reports.umusic.net',
  projectID: '9F6387B5461149B8B8EBC0B160B3BAFD',
  dossierID: '67ADCACC47C586AD5DE95B9E261CBC06',
  username: 'kiruthiga.natrajan@umusic.com',
  password: 'Kiruthiga@234'
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

const getProjectsOptions = (token) => {
  return {
    method: 'GET',
    credentials: 'include', //include cookie
    mode: 'cors', //set as CORS mode for cross origin resource sharing
    headers: {
      'Content-Type': 'application/json',
      'X-MSTR-AuthToken': token,
    }
  };
};

const getOptions = (token) => {
  return {
    method: 'POST',
    credentials: 'include', //include cookie
    mode: 'no-cors', //set as CORS mode for cross origin resource sharing
    headers: {
      'Content-Type': 'application/json',
      'X-MSTR-AuthToken': token,
      'X-MSTR-ProjectID': config.projectID,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      "includeDetailedPages": false,
    })
  };
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
  const [isDownloading, setIsDownloading] = useState(false);

  const update = (modified) => {
    // console.log(modified);

    let temp = [];
    for (const key in modified) {
      const sel = modified[key].filterDetail.items.filter(item => item.selected).map(item => ({
        name: item.name,
        value: item.value,
        filterName: modified[key].filterName,
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

  const getProjects = () => {
    console.log('getProjects : ', token);
    const options = getProjectsOptions(token);
    console.log(baseRestURL + '/api/projects');
    console.log(options);

    return fetch(baseRestURL + '/api/projects', options).then((response) => {
      console.log(response.headers.get('Content-Type'));
      console.log(response.headers.get('Date'));

      console.log(response.status);
      console.log(response.statusText);
      console.log(response.type);
      console.log(response.url);
      response.json().then((json) => {
        console.log(json);
      });
    }).catch((error) => {
        console.log(error);
    });
  }

  const createDocumentInstance = () => {
    setIsDownloading(true);
    console.log('createDocumentInstance : ', token);
    // const options = getOptions(token);
    console.log(baseRestURL + '/api/documents');

    const bodyFilters = () => {
      const filters = []

      if (selected.length > 0) {
        const filterKeyMap = selected.reduce((acc, selection) => {
          if(acc[selection.key]) {
            acc[selection.key].push(selection);
          } else {
            acc[selection.key] = [selection];
          }
          return acc;
        }, {});

        for (const filterKey of Object.keys(filterKeyMap)) {
          const filterDataObj = { key: filterKey};
          const selectionsObj = filterKeyMap[filterKey].map(selection => ({ id: selection.value, name: selection.name}));
          filterDataObj.selections = selectionsObj;
          filters.push(filterDataObj);
        }

        console.log(filters);
        return { filters };

      } else {
        return {};
      }
    };

    const options = {
      method: 'POST',
      credentials: 'include', //include cookie
      mode: 'cors', //set as CORS mode for cross origin resource sharing
      headers: {
        'Content-Type': 'application/json',
        'X-MSTR-AuthToken': token,
        'X-MSTR-ProjectID': config.projectID,
        'Accept': 'application/json'
      },
      body: JSON.stringify(bodyFilters()/* {
          "filters": [
              {
                  "key": "WC6539D78A8AA49BC9EEE2AF41D6791DD",
                  "name": "Artist Name",
                  "selections": [
                      {
                          "id":"hAriana Grande;848EFF174FD3AFD22A3B29827E57574C",
                          "name": "Ariana Grande"
                      }
                  ]
              }
          ]
      } */)
    };

    console.log(options);

    return fetch(`${baseRestURL}/api/documents/${config.dossierID}/instances`, options).then((response) => {
      console.log(response.headers.get('Content-Type'));
      console.log(response.headers.get('Date'));

      console.log(response.status);
      console.log(response.statusText);
      console.log(response.type);
      console.log(response.url);
      response.json().then((json) => {
        console.log(json);

        exportPDF(json.mid);
      });
    }).catch((error) => {
        console.log(error);
    });
  }

  const exportPDF = (mid) => {
    console.log('exportPDF : ', mid);
    const options = getOptions(token);

    return fetch(`${baseRestURL}/api/documents/${config.dossierID}/instances/${mid}/pdf`, options).then((response) => {
      response.json().then((json) => {
        console.log(json);
        setIsDownloading(false);
        async function createPDF(json) {
          // create a download anchor tag
          var downloadLink      = document.createElement('a');
          downloadLink.target   = '_blank';
          downloadLink.download = 'RoyaltyAnalytics.pdf';

          const base64Response = await fetch(`data:application/pdf;base64,${json.data}`);

          // convert downloaded data to a Blob
          // var blob = new Blob([], { type: 'application/pdf' });
          const blob = await base64Response.blob();

          // create an object URL from the Blob
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          // set object URL as the anchor's href
          downloadLink.href = downloadUrl;

          // append the anchor to document body
          document.body.append(downloadLink);

          // fire a click event on the anchor
          downloadLink.click();

          // cleanup: remove element and revoke object URL
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(downloadUrl);
        }

        createPDF(json);

      });
    }).catch((error) => {
        console.log(error);
    });
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
          console.log(filterList);
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
                  key: fl.filterKey,
                  filterName: fl.filterName
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
        console.log('got token: ' + tkn);
        // getProjects(tkn);
        setToken(tkn);
      }).catch((error) => {
          console.log(error);
      });
    } else {
      if (window.microstrategy) {
        console.log('populateDossiers ', token);
        populateDossiers(token);
      } else {
        setTimeout(() => {
          console.log('2nd populateDossiers ', token);
          populateDossiers(token);
        }, 2000)
      }
    }
  }, [token]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar>
          <Toolbar variant="dense">
            <div className="logo-container">
              <img className={classes.imageIcon} src="/universal-music-group-logo.png" alt="logo" />
            </div>
            <div>
            <div className="header">
              <div>
                <img src="/dashboard.svg"/>
                <span>Dashboard</span>
              </div>
              <div className="selected">
                <img src="/analytics.svg"/>
                <span>Analytics</span>
              </div>
              <div><img src="/statements.svg"/>
              <span>Statements</span></div>
              <div><img src="/payments.svg"/><span>Payments</span></div>
              <div><img src="/pipeline.svg"/>Pipeline</div>
            </div>
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
                    <Chip key={`${s.key}-${s.name}`} label={<><label style={{fontSize: '12px',lineHeight: '15px',color: '#989CA0'}}>{s.filterName}</label>: <span style={{fontSize: '14px', fontWeight: 'normal',lineHeight: '18px',color: '#141618'}}>{s.name}</span></>} onDelete={e => handleDelete(s)}
                    //   classes={{
                    //     colorSecondary: classes[`color-${filterIndexMap[s.key]}-bgColor`],
                    //   }}
                    //   color="secondary" 
                      />
                  ))}
                </div>
                <div className="actions box">

                  {Boolean(selected.length) && <div className="action-combo">
                    <Button component="div" variant="contained" color="secondary" onClick={clearAll}>Clear Filters</Button>
                  </div>}
                  <div className="action-combo">
                    <Button component="div" variant="contained" disabled={isPopupFilterOpen} onClick={applyFilters}>Apply</Button>
                    {isDownloading? <IconButton><CircularProgress color="secondary" /></IconButton>:
                    <IconButton onClick={e => createDocumentInstance()}>
                      <CloudDownloadIcon color="secondary"/>
                    </IconButton>}
                  </div>
                </div>
              </div>
              <div className="filter-headers box">
                <FilterHeaders isOpen={console.log/*setIsPopupFilterOpen*/} filters={filters} update={update}/>
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