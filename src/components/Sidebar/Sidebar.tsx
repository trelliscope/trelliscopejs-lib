import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLabels from '../SidebarLabels';
import SidebarLayout from '../SidebarLayout';
import SidebarSort from '../SidebarSort';
import SidebarViews from '../SidebarViews';
import {
  contentHeightSelector,
  sidebarActiveSelector,
  filterColSplitSelector,
  sidebarHeightSelector,
} from '../../selectors/ui';
import { filterStateSelector, filterViewSelector, labelsSelector, cogDescSelector } from '../../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_CONFIG, SB_VIEWS } from '../../constants';
import getCustomProperties from '../../getCustomProperties';
import { addFilter, clearFilters, setFilterView } from '../../slices/filterSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import { selectSort, setSort } from '../../slices/sortSlice';
import { cogFiltDistSelector } from '../../selectors/cogData';
import styles from './Sidebar.module.scss';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import SidebarFilter from '../SidebarFilter';

const Sidebar: React.FC = () => {
  const [sidebarHeaderHeight] = getCustomProperties(['--sidebar-header-height']) as number[];
  const [sidebarWidth] = getCustomProperties(['--sidebar-width']) as number[];
  const dispatch = useDispatch();
  const { isSuccess: displayLoaded, data: curDisplayInfo } = useDisplayInfo();
  const contentHeight = useSelector(contentHeightSelector);
  const active = useSelector(sidebarActiveSelector);
  const filterColSplit = useSelector(filterColSplitSelector);
  const filter = useSelector(filterStateSelector);
  const filterView = useSelector(filterViewSelector);
  const metas = useDisplayMetas();
  const sidebarHeight = useSelector(sidebarHeightSelector);
  const filtDist = useSelector(cogFiltDistSelector);
  const labels = useSelector(labelsSelector);
  const colSplit = useSelector(filterColSplitSelector);
  const sort = useSelector(selectSort);
  const cogDesc = useSelector(cogDescSelector);
  const ch = useSelector(contentHeightSelector);

  const height = contentHeight - sidebarHeaderHeight;
  const views = curDisplayInfo?.views;

  const handleLabelChange = (value: string) => {
    const idx = labels.indexOf(value);
    let newLabels = labels;
    if (idx === -1) {
      newLabels = [...labels, value];
    } else {
      newLabels = [...labels.slice(0, idx), ...labels.slice(idx + 1)];
    }
    dispatch(setLabels(newLabels));
  };

  /* const handleViewChange = (x: string, which: 'add' | 'remove') => {
    // if a filter is being added to the view, add a panel label for the variable
    if (which === 'add') {
      if (labels.indexOf(x) < 0) {
        const newLabels = Object.assign([], labels);
        newLabels.push(x);
        dispatch(setLabels(newLabels));
      }
    }
    dispatch(setFilterView({ name: x, which }));
  };

  const handleFilterChange = (x: Filter<FilterCat | FilterRange> | string) => {
    if (typeof x === 'string' || x instanceof String) {
      dispatch(setFilter(x as string));
    } else {
      const obj: { [key: string]: Filter<FilterCat | FilterRange> } = {};
      obj[x.name] = { ...x } as Filter<FilterCat | FilterRange>;
      dispatch(setFilter(obj));
    }
    dispatch(setLayout({ page: 1 }));
  };

  const handleFilterSortChange = (x: Filter<FilterCat>) => {
    const obj: { [key: string]: Filter<FilterCat> } = {};
    obj[x.name] = x;
    dispatch(setFilter(obj));
  }; */

  const handleSortChange = (sortSpec: Sort[] | number) => {
    dispatch(setSort(sortSpec));
    dispatch(setLayout({ page: 1 }));
  };

  const addSortLabel = (name: string) => {
    // if a sort variable is being added, add a panel label for the variable
    if (labels.indexOf(name) < 0) {
      const newLabels = Object.assign([], labels);
      newLabels.push(name);
      dispatch(setLabels(newLabels));
    }
  };

  const handleViewsChange = (value: string) => {
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
      const viewsLabels = hashItems.labels.split(',');
      dispatch(setLabels(viewsLabels));
    }

    // sort
    let viewsSort = [] as Sort[];
    if (hashItems.sort) {
      viewsSort = hashItems.sort.split(',').map((d, i) => {
        const vals = d.split(';');
        return {
          order: i + 1,
          name: vals[0],
          dir: vals[1] as SortDir,
        };
      });
    }
    dispatch(setSort(viewsSort));

    // filter
    const viewsFilter = {} as { [key: string]: Filter<FilterCat | FilterRange> };
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
          varType: metas[fltItems.var].type,
        } as Filter<FilterCat | FilterRange>;
        if (fltItems.type === 'select') {
          fltState.orderValue = 'ct,desc';
          fltState.value = fltItems.val.split('#').map(decodeURIComponent);
        } else if (fltItems.type === 'regex') {
          const { levels } = metas[fltItems.var];
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
        viewsFilter[fltItems.var] = fltState;
      });
    }
    // first need to reset them all
    dispatch(clearFilters());
    dispatch(addFilter(viewsFilter));

    // filterView (just add - if something's already there we won't remove it)
    if (hashItems.fv) {
      hashItems.fv.split(',').map((el) => dispatch(setFilterView({ name: el, which: 'add' })));
    }
  };

  const activeIsTaller = sort.length * 51 > sidebarHeight - 2 * 51;
  let activeHeight = 51 * sort.length;
  if (activeIsTaller) {
    const n = Math.ceil((sidebarHeight * 0.6) / 51);
    activeHeight = n * 51 - 25;
  }

  const sort2 = Object.assign([], sort) as Sort[];
  const notUsed = Object.keys(cogDesc);
  if (cogDesc) {
    for (let i = 0; i < sort.length; i += 1) {
      const index = notUsed.indexOf(sort[i].name);
      if (index > -1) {
        notUsed.splice(index, 1);
      }
    }
  }

  const customStyles = {
    sidebarContainer: {
      width: sidebarWidth * (1 + (active === SB_PANEL_FILTER && filterColSplit && filterColSplit.cutoff !== null ? 1 : 0)),
      height: contentHeight,
    },
  };

  return (
    <div
      className={classNames(active === '' ? [styles.sidebarHidden, styles.sidebarContainer] : styles.sidebarContainer)}
      style={customStyles.sidebarContainer}
    >
      <div className={styles.sidebarHeader}>{active}</div>
      {active === SB_CONFIG && <div className={styles.sidebarEmpty}>Configuration...</div>}
      {!displayLoaded && <div className={styles.sidebarEmpty}>Load a display...</div>}
      {active === SB_PANEL_LAYOUT && displayLoaded && <SidebarLayout />}
      {active === SB_PANEL_FILTER && displayLoaded && <SidebarFilter />}
      {/* <SidebarFilter
          filter={filter}
          filterView={filterView}
          metas={metas as IMeta[]}
          sidebarHeight={sidebarHeight}
          curDisplayInfo={curDisplayInfo}
          filtDist={filtDist}
          colSplit={colSplit}
          handleViewChange={handleViewChange}
          handleFilterChange={handleFilterChange}
          handleFilterSortChange={handleFilterSortChange}
        /> */}
      {active === SB_PANEL_SORT && displayLoaded && (
        <SidebarSort
          handleSortChange={handleSortChange}
          addSortLabel={addSortLabel}
          sort={sort}
          curDisplayInfo={curDisplayInfo}
          cogDesc={cogDesc}
          sidebarHeight={sidebarHeight}
          activeHeight={activeHeight}
          sort2={sort2}
          notUsed={notUsed}
        />
      )}
      {active === SB_PANEL_LABELS && displayLoaded && (
        <SidebarLabels
          sidebarHeaderHeight={sidebarHeaderHeight}
          ch={ch}
          labels={labels}
          metas={metas as IMeta[]}
          handleLabelChange={handleLabelChange}
        />
      )}
      {active === SB_VIEWS && displayLoaded && (
        <SidebarViews handleViewsChange={handleViewsChange} height={height} views={views} />
      )}
    </div>
  );
};

export default Sidebar;
