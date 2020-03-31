import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import { createSelector } from 'reselect';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {
  setLabels, setLayout, setSort, setFilter, setFilterView
} from '../actions';

import { contentHeightSelector } from '../selectors/ui';
import { curDisplayInfoSelector } from '../selectors';
import { cogInfoSelector } from '../selectors/display';
import uiConsts from '../assets/styles/uiConsts';

const SidebarViews = ({
  height, views, cinfo, handleChange
}) => {
  const content = (
    <div style={{ height, overflowY: 'auto' }}>
      <List style={{ padding: 0 }}>
        {views.map((value) => (
          <ListItem
            key={value.name}
            dense
            button
            onClick={() => handleChange(value.state, cinfo)}
          >
            <ListItemText
              primary={value.name}
              // secondary={value.desc}
              // style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
  return (content);
};

SidebarViews.propTypes = {
  height: PropTypes.number.isRequired,
  // sheet: PropTypes.object.isRequired,
  views: PropTypes.array.isRequired,
  cinfo: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  rowDesc: {
    color: '#888',
    fontStyle: 'italic'
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector, curDisplayInfoSelector, cogInfoSelector,
  (ch, cdi, cinfo) => ({
    width: uiConsts.sidebar.width,
    height: ch - uiConsts.sidebar.header.height,
    views: cdi.info.views,
    cinfo
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (value, cinfo) => {
    const hashItems = {};
    value.replace('#', '').split('&').forEach((d) => {
      const tuple = d.split('=');
      hashItems[tuple[0]] = tuple[[1]];
    });

    if (hashItems.nrow && hashItems.ncol && hashItems.arr) {
      const layout = {
        nrow: parseInt(hashItems.nrow, 10),
        ncol: parseInt(hashItems.ncol, 10),
        arrange: hashItems.arr
      };
      dispatch(setLayout(layout));
    }

    // need to do page number separately because it is recomputed when nrow/ncol are changed
    if (hashItems.pg) {
      dispatch(setLayout({ pageNum: parseInt(hashItems.pg, 10) }));
    }

    // labels
    if (hashItems.labels) {
      const labels = hashItems.labels.split(',');
      dispatch(setLabels(labels));
    }

    // sort
    let sort = [];
    if (hashItems.sort) {
      sort = hashItems.sort.split(',').map((d, i) => {
        const vals = d.split(';');
        return ({
          order: i + 1,
          name: vals[0],
          dir: vals[1]
        });
      });
    }
    dispatch(setSort(sort));

    // filter
    const filter = {};
    if (hashItems.filter) {
      const fltrs = hashItems.filter.split(',');
      fltrs.forEach((flt) => {
        const fltItems = {};
        flt.split(';').forEach((d) => {
          const tuple = d.split(':');
          fltItems[tuple[0]] = tuple[[1]];
        });
        // fltItems.var
        const fltState = {
          name: fltItems.var,
          type: fltItems.type,
          varType: cinfo[fltItems.var].type
        };
        if (fltItems.type === 'select') {
          fltState.orderValue = 'ct,desc';
          fltState.value = fltItems.val.split('#').map(decodeURIComponent);
        } else if (fltItems.type === 'regex') {
          const { levels } = cinfo[fltItems.var];
          const vals = [];
          const rval = new RegExp(decodeURIComponent(fltItems.val), 'i');
          levels.forEach((d) => { if (d.match(rval) !== null) { vals.push(d); } });
          fltState.regex = fltItems.val;
          fltState.value = vals;
          fltState.orderValue = 'ct,desc';
        } else if (fltItems.type === 'range') {
          const from = fltItems.from ? parseFloat(fltItems.from, 10) : undefined;
          const to = fltItems.to ? parseFloat(fltItems.to, 10) : undefined;
          fltState.value = { from, to };
          fltState.valid = true;
          if (from && to && from > to) {
            fltState.valid = false;
          }
        }
        filter[fltItems.var] = fltState;
      });
    }
    // first need to reset them all
    dispatch(setFilter({}));
    dispatch(setFilter(filter));

    // filterView (just add - if something's already there we won't remove it)
    if (hashItems.fv) {
      hashItems.fv.split(',').map((el) => dispatch(setFilterView(el, 'add')));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(SidebarViews));
