import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLabels from '../SidebarLabels';
import SidebarLayout from '../SidebarLayout';
import SidebarSort from '../SidebarSort';
import SidebarFilter from '../SidebarFilter';
import SidebarViews from '../SidebarViews';
import {
  contentHeightSelector,
  sidebarActiveSelector,
  filterColSplitSelector,
  sidebarHeightSelector,
} from '../../selectors/ui';
import {
  curDisplayInfoSelector,
  displayLoadedSelector,
  filterStateSelector,
  filterViewSelector,
  labelsSelector,
} from '../../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_CONFIG, SB_VIEWS } from '../../constants';
import getCustomProperties from '../../getCustomProperties';
import { setFilter, setFilterView } from '../../slices/filterSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import { cogInfoSelector } from '../../selectors/display';
import { cogFiltDistSelector } from '../../selectors/cogData';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  const [sidebarHeaderHeight] = getCustomProperties(['--sidebar-header-height']) as number[];
  const [sidebarWidth] = getCustomProperties(['--sidebar-width']) as number[];
  const dispatch = useDispatch();
  const contentHeight = useSelector(contentHeightSelector);
  const active = useSelector(sidebarActiveSelector);
  const displayLoaded = useSelector(displayLoadedSelector);
  const filterColSplit = useSelector(filterColSplitSelector);
  const filter = useSelector(filterStateSelector);
  const filterView = useSelector(filterViewSelector);
  const cogInfo = useSelector(cogInfoSelector);
  const sidebarHeight = useSelector(sidebarHeightSelector);
  const curDisplayInfo = useSelector(curDisplayInfoSelector);
  const filtDist = useSelector(cogFiltDistSelector);
  const labels = useSelector(labelsSelector);
  const colSplit = useSelector(filterColSplitSelector);
  const ch = useSelector(contentHeightSelector);

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

  const handleViewChange = (x: string, which: 'add' | 'remove') => {
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
    dispatch(setLayout({ pageNum: 1 }));
  };

  const handleFilterSortChange = (x: Filter<FilterCat>) => {
    const obj: { [key: string]: Filter<FilterCat> } = {};
    obj[x.name] = x;
    dispatch(setFilter(obj));
  };

  const customStyles = {
    sidebarContainer: {
      width: sidebarWidth * (1 + (active === SB_PANEL_FILTER && filterColSplit && filterColSplit.cutoff !== null ? 1 : 0)),
      height: contentHeight,
    },
  };

  if (active === '') {
    return <div className={`${styles.sidebarContainer} ${styles.sidebarHidden}`} style={customStyles.sidebarContainer} />;
  }

  let content;
  if (active === SB_CONFIG) {
    content = <div className={styles.sidebarEmpty}>Configuration...</div>;
  } else if (!displayLoaded) {
    content = <div className={styles.sidebarEmpty}>Load a display...</div>;
  } else {
    switch (active) {
      case SB_PANEL_LAYOUT:
        content = (
          <div>
            <SidebarLayout />
          </div>
        );
        break;
      case SB_PANEL_FILTER:
        content = (
          <div>
            <SidebarFilter
              filter={filter}
              filterView={filterView}
              cogInfo={cogInfo}
              sidebarHeight={sidebarHeight}
              curDisplayInfo={curDisplayInfo}
              filtDist={filtDist}
              colSplit={colSplit}
              handleViewChange={handleViewChange}
              handleFilterChange={handleFilterChange}
              handleFilterSortChange={handleFilterSortChange}
            />
          </div>
        );
        break;
      case SB_PANEL_SORT:
        content = (
          <div>
            <SidebarSort />
          </div>
        );
        break;
      case SB_PANEL_LABELS:
        content = (
          <div>
            <SidebarLabels
              sidebarHeaderHeight={sidebarHeaderHeight}
              ch={ch}
              labels={labels}
              curDisplayInfo={curDisplayInfo}
              cogInfo={cogInfo}
              handleLabelChange={handleLabelChange}
            />
          </div>
        );
        break;
      case SB_VIEWS:
        content = (
          <div>
            <SidebarViews />
          </div>
        );
        break;
      default:
        content = '';
    }
  }

  return (
    <div className={styles.sidebarContainer} style={customStyles.sidebarContainer}>
      <div className={styles.sidebarHeader}>{active}</div>
      {content}
    </div>
  );
};

export default Sidebar;
