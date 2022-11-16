import React from 'react';
import type { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { setFilter, setFilterView } from '../../slices/filterSlice';
import { setSort } from '../../slices/sortSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import { contentHeightSelector } from '../../selectors/ui';
import { curDisplayInfoSelector } from '../../selectors';
import { cogInfoSelector } from '../../selectors/display';
import { RootState } from '../../store';
import getCustomProperties from '../../getCustomProperties';
import styles from './SidebarViews.module.scss';

interface SidebarViewsProps {
  height: number;
  views: ViewItem[];
  cinfo: { [key: string]: CogInfo };
  handleChange: (state: string, cinfo: { [key: string]: CogInfo }) => void;
}
const SidebarViews: React.FC<SidebarViewsProps> = ({ height, views, cinfo, handleChange }) => (
  <div className={styles.sidebarViews} style={{ height }}>
    <List className={styles.sidebarViewsList}>
      {views.map((value) => (
        <ListItem key={value.name} dense button onClick={() => handleChange(value.state, cinfo)}>
          <ListItemText primary={value.name} />
        </ListItem>
      ))}
    </List>
  </div>
);

const [sidebarWidth, sidebarHeaderHeight] = getCustomProperties(['--sidebar-width', 'sidebarHeaderHeight']) as number[];

// ------ redux container ------
const stateSelector = createSelector(contentHeightSelector, curDisplayInfoSelector, cogInfoSelector, (ch, cdi, cinfo) => ({
  width: sidebarWidth,
  height: ch - sidebarHeaderHeight,
  views: cdi.info.views,
  cinfo,
}));

const mapStateToProps = (state: RootState) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleChange: (value: string, cinfo: { [key: string]: CogInfo }) => {
    const hashItems = {} as HashItem;
    value
      .replace('#', '')
      .split('&')
      .forEach((d) => {
        const tuple = d.split('=');
        const [key, val] = tuple;
        hashItems[key] = val;
      });

    if (hashItems.nrow && hashItems.ncol && hashItems.arr) {
      const layout = {
        nrow: parseInt(hashItems.nrow, 10),
        ncol: parseInt(hashItems.ncol, 10),
        arrange: hashItems.arr,
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
    let sort = [] as Sort[];
    if (hashItems.sort) {
      sort = hashItems.sort.split(',').map((d, i) => {
        const vals = d.split(';');
        return {
          order: i + 1,
          name: vals[0],
          dir: vals[1] as SortDir,
        };
      });
    }
    dispatch(setSort(sort));

    // filter
    const filter = {} as { [key: string]: Filter<FilterCat | FilterRange> };
    if (hashItems.filter) {
      const fltrs = hashItems.filter.split(',');
      fltrs.forEach((flt) => {
        const fltItems = {} as HashItem;
        flt.split(';').forEach((d) => {
          const tuple = d.split(':');
          const [key, val] = tuple;
          fltItems[key] = val;
        });
        // fltItems.var
        const fltState = {
          name: fltItems.var,
          type: fltItems.type,
          varType: cinfo[fltItems.var].type,
        } as Filter<FilterCat | FilterRange>;
        if (fltItems.type === 'select') {
          fltState.orderValue = 'ct,desc';
          fltState.value = fltItems.val.split('#').map(decodeURIComponent);
        } else if (fltItems.type === 'regex') {
          const { levels } = cinfo[fltItems.var];
          const vals = [] as string[];
          const rval = new RegExp(decodeURIComponent(fltItems.val), 'i');
          levels.forEach((d) => {
            if (d.match(rval) !== null) {
              vals.push(d);
            }
          });
          fltState.regex = fltItems.val;
          fltState.value = vals;
          fltState.orderValue = 'ct,desc';
        } else if (fltItems.type === 'range') {
          const from = fltItems.from ? parseFloat(fltItems.from) : undefined;
          const to = fltItems.to ? parseFloat(fltItems.to) : undefined;
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
      hashItems.fv.split(',').map((el) => dispatch(setFilterView({ name: el, which: 'add' })));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarViews);
