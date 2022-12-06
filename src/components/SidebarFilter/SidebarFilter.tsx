import React from 'react';
import intersection from 'lodash.intersection';
import FilterCat from '../FilterCat';
import FilterNum from '../FilterNum';
import { DisplayInfoState } from '../../slices/displayInfoSlice';
import SidebarFilterNotUsed from '../SidebarFilterNotUsed';
import SidebarFilterContainer from '../SidebarFilterContainer';
import styles from './SidebarFilter.module.scss';

interface SidebarFilterProps {
  filter: {
    [key: string]: Filter<FilterCat | FilterRange>;
  };
  filterView: FilterView;
  cogInfo: { [key: string]: CogInfo };
  sidebarHeight: number;
  curDisplayInfo: DisplayInfoState;
  filtDist: { [key: string]: CondDistFilterCat | CondDistFilterNum };
  colSplit: {
    cutoff: number | null;
    heights: [number, number];
  };
  handleViewChange: (x: string, which: 'add' | 'remove') => void;
  handleFilterChange: (x: Filter<FilterCat | FilterRange> | string) => void;
  handleFilterSortChange: (x: Filter<FilterCat>) => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filter,
  filterView,
  cogInfo,
  sidebarHeight,
  curDisplayInfo,
  filtDist,
  colSplit,
  handleViewChange,
  handleFilterChange,
  handleFilterSortChange,
}) => {
  const catHeight = 125;
  const inlineStyles = {
    col1: {
      height: sidebarHeight,
    },
    col2: {
      height: sidebarHeight,
      display: colSplit.cutoff === null ? 'none' : 'inline',
    },
    notUsedContainer: {
      height: sidebarHeight - 35 - colSplit.heights[colSplit.cutoff === null ? 0 : 1],
    },
    allContainer: {
      height: sidebarHeight,
    },
  };

  let content = <div />;
  const displId = curDisplayInfo.info.name;
  const { cogGroups } = curDisplayInfo.info;
  if (filter && filterView.active && colSplit) {
    let col1filters = [];
    let col2filters: string[] = [];
    if (colSplit.cutoff === null) {
      col1filters = filterView.active;
    } else {
      col1filters = filterView.active.slice(0, colSplit.cutoff);
      col2filters = filterView.active.slice(colSplit.cutoff, filterView.active.length);
    }
    const colFilters = [col1filters, col2filters];

    const colContent = colFilters.map((curFilters) =>
      curFilters.map((d: string) => {
        if (filtDist[d]) {
          let filterState = filter[d] as Filter<FilterCat | FilterRange>;
          let headerExtra = '';
          const filterActive = filterState && filterState.value !== undefined;

          let itemContent = <div key={`${d}_${displId}`}>{d}</div>;
          if (cogInfo[d].type === 'factor' || cogInfo[d].type === 'time' || cogInfo[d].type === 'date') {
            if (!filterState) {
              filterState = {
                name: d,
                orderValue: 'ct,desc',
                type: 'select',
                varType: 'factor',
                value: [],
              };
            }

            const nlvl = cogInfo[d].levels ? cogInfo[d].levels.length : 1000;

            itemContent = (
              <FilterCat
                filterState={filterState as Filter<FilterCat>}
                height={Math.min(catHeight, nlvl * 15)}
                dist={curDisplayInfo.info.cogDistns[d]}
                condDist={filtDist[d] as CondDistFilterCat}
                levels={curDisplayInfo.info.cogInfo[d].levels}
                handleChange={handleFilterChange}
                handleSortChange={handleFilterSortChange}
              />
            );
            headerExtra = `${(filtDist[d] as CondDistFilterCat).totSelected} of ${filtDist[d].dist.length}`;
          } else if (cogInfo[d].type === 'numeric') {
            if (!filterState) {
              filterState = {
                name: d,
                orderValue: 'ct,desc',
                type: 'range',
                varType: 'numeric',
                valid: false,
              };
            }

            itemContent = (
              <FilterNum
                name={d}
                filterState={filterState as Filter<FilterRange>}
                dist={curDisplayInfo.info.cogDistns[d]}
                condDist={filtDist[d] as CondDistFilterNum}
                handleChange={handleFilterChange}
              />
            );
          }
          return (
            <SidebarFilterContainer
              cogInfo={cogInfo}
              handleViewChange={handleViewChange}
              handleFilterChange={handleFilterChange}
              filterActive={filterActive}
              headerExtra={headerExtra}
              displId={displId}
              filterState={filterState}
              itemContent={itemContent}
              d={d}
            />
          );
        }
        return '';
      }),
    );

    const extraIdx = colSplit.cutoff === null ? 0 : 1;
    const cogNames = Object.keys(cogInfo);
    const inames = intersection(cogNames, filterView.inactive);
    if ((inlineStyles?.notUsedContainer?.height || 0) < 170 && extraIdx === 1) {
      colContent[extraIdx].push(
        <div key="notUsedHeader" className={styles.sidebarFilterNotUsedHeader}>
          Remove filters to select more.
        </div>,
      );
    } else {
      colContent[extraIdx].push(
        <div key="notUsedHeader" className={styles.sidebarFilterNotUsedHeader}>
          {filterView.active.length === 0
            ? 'Select a variable to filter on:'
            : filterView.inactive.length === 0
            ? ''
            : 'More variables:'}
        </div>,
      );
      colContent[extraIdx].push(
        <SidebarFilterNotUsed
          filter={filter}
          cogInfo={cogInfo}
          handleViewChange={handleViewChange}
          inlineStyles={inlineStyles}
          cogGroups={cogGroups}
          inames={inames}
          displId={displId}
        />,
      );
    }

    content = (
      <div className={styles.sidebarFilterAllContainer} style={inlineStyles.allContainer}>
        <div className={styles.sidebarFilterCol1} style={inlineStyles.col1}>
          {colContent[0]}
        </div>
        <div className={styles.sidebarFilterCol2} style={inlineStyles.col2}>
          {colContent[1]}
        </div>
      </div>
    );
  }
  return content;
};

export default SidebarFilter;
