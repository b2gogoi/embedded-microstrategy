import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Portal from '@material-ui/core/Portal';
import Checkbox from '@material-ui/core/Checkbox';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import useStyles from './styles';

export default function FilterHeaders({filters, update, isOpen}: props) {
    const [filtersMap, setFiltersMap] = useState({});
    const updateAll = (filter) => {
        const temp = filtersMap[filter.filterKey];
        temp.filterDetail.items = filter.items

        const map = {...filtersMap, [filter.filterKey]: temp};
        setFiltersMap(map);
        update(map);
    };

    useEffect(() => {
        setFiltersMap(filters.reduce((acc, filterObj) => {
            acc[filterObj.filterKey] = filterObj;
            return acc;
        }, {}))
    }, [filters]);
    return (<>
        {Object.values(filtersMap).map(f => <FHeader isOpen={isOpen} key={f.filterKey} filterKey={f.filterKey} name={f.filterName} items={f.filterDetail.items} update={updateAll} />)}
    </>)
}

function AttributesSelector({key, items, update}: props) {
    const classes = useStyles();
    const [state, setState] = useState(items.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
    }, {}));

    const [attributes, setAttributes] = useState(items);

    const [searchValue, setSearchValue] = useState();

    const handleChange = (item) => {
        const itemState = !state[item.name].selected;
        const clone = {...state, [item.name]: {...item, selected: itemState}};
        setState(clone);
        const updatedData = Object.values(clone);
        
        update(updatedData);
    }

    const clearAll = () => {
        setState(items.reduce((acc, item) => {
            acc[item.name] = {...item, selected: false};
            return acc;
        }, {}));
        update(items.map(item => ({...item, selected: false})));
    }

    const filterAttributes = (search) => {
        setSearchValue(search)

        if (search && Boolean(search.trim().length)) {

            return items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
            
        } else {
            console.log('Search people empty : ', search);
            return [];    
        }
    }

    const searchMate = (e) => {
        const partial = e.target.value;
        setSearchValue(partial);
        
        if (partial) {
            if (partial.length > 2) {
                setAttributes(filterAttributes(partial));
            }
        } else {
            setSearchValue('');
            setAttributes(items);
        }
    }

    return (<div style={{
        // border: `1px solid ${classes[`color-${key}-border`]}`,
        border: `1px solid #FFED94`,
        maxHeight: 400,
        minWidth: 200,
        overflowY: 'auto',
        borderRadius: 4,
        backgroundColor: '#141618',
        color: '#fff',
        paddingTop: 20,
        textAlign: 'left',
      }}>
          {/* /className="attributes-selector"  */}
        {items.length > 10 && <OutlinedInput color="primary"
            value={searchValue}
            placeholder='type 3 chars to search'
            size="small"
            onChange={searchMate}
            startAdornment={<InputAdornment position="start"><SearchOutlinedIcon /> </InputAdornment>}
            labelWidth={0}
        />}
        <div className="clearLink" onClick={e => clearAll()}>Clear All</div>
        {attributes.map(item => <div className="dropdown-item-checkbox" key={item.name} 
            onClick={e => {
                e.preventDefault();
                handleChange(item);
            }}>
            <Checkbox
                checked={state[item.name].selected}
                onChange={e => handleChange(item)}
                name={item.name}
            />
            <label htmlFor={item.name}>{item.name}</label>
        </div>)}
    </div>)
}

function FHeader({filterKey, name, items, update, isOpen}: props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClose = () => {
        // setAnchorEl(null);
        console.log('filter closed');
        // isOpen(false);
    };

    const open = Boolean(anchorEl);

    const showPopupFilters = (e) => {
        setAnchorEl(e.currentTarget);
        isOpen(true);
    };

    const id = open ? `filter-popover-${name}` : undefined;

    const selectionUpdated = (items) => {
        // console.log('selectionUpdated', items);
        const filterSelections = {
            filterKey,
            name,
            items
        }
        console.log(`${name} has ${items.length} selections`);
        console.log(filterSelections);
        update(filterSelections);
    }

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
      };
    
      const handleClickAway = () => {
        setAnchorEl(null);
      };

    return (<>
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <div className="col-header" onClick={handleClick}>
            {name}
        </div>
        {open ? (
            <Popper id={id} open={open} anchorEl={anchorEl} disablePortal={true}>
                <AttributesSelector items={items} update={selectionUpdated} name={name} fkey={filterKey} />
            </Popper>
        ) : null}
      </div>
    </ClickAwayListener>
        {/* <ClickAwayListener onClickAway={handleClose}>

         */}
        {/* <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >  */}
        
        {/* <Popper id={id} open={open} anchorEl={anchorEl} disablePortal={true}>
            <AttributesSelector items={items} update={selectionUpdated} name={name} fkey={filterKey} />
        </Popper> */}
        {/* </Popover> */}
        {/* </ClickAwayListener> */}
    </>);
}