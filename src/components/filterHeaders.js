import React, { useEffect, useState } from 'react';
import Popover from '@material-ui/core/Popover';
import Checkbox from '@material-ui/core/Checkbox';

export default function FilterHeaders({filters, update}: props) {
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
        {Object.values(filtersMap).map(f => <FHeader key={f.filterKey} filterKey={f.filterKey} name={f.filterName} items={f.filterDetail.items} update={updateAll} />)}
    </>)
}

function AttributesSelector({items, update}: props) {
    const [state, setState] = useState(items.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
    }, {}));

    const handleChange = (item) => {
        const itemState = !state[item.name].selected;
        const clone = {...state, [item.name]: {...item, selected: itemState}};
        setState(clone);
        const updatedData = Object.values(clone);
        
        update(updatedData);
    }

    const clearAll = () => {
        setState(items.reduce((acc, item) => {
            acc[item.name] = false;
            return acc;
        }, {}));
        update(items.map(item => ({...item, selected: false})));
    }

    return (<div className="attributes-selector">
        <div className="clearLink" onClick={e => clearAll()}>Clear All</div>
        {items.map(item => <div className="dropdown-item-checkbox" key={item.name}>
            <Checkbox
                checked={state[item.name].selected}
                onChange={e => handleChange(item)}
                name={item.name}
            />
            <label htmlFor={item.name}>{item.name}</label>
        </div>)}
    </div>)
}

function FHeader({filterKey, name, items, update}: props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const showPopupFilters = (e) => {
        setAnchorEl(e.currentTarget);
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

    return (<>
        <div className="col-header" onClick={showPopupFilters}>
            {name}
        </div>
        <Popover
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
        >
            <AttributesSelector items={items} update={selectionUpdated} name={name}/>
        </Popover>
    </>);
}