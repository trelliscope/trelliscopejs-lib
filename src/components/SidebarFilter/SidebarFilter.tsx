import React from 'react';
import intersection from 'lodash.intersection';
import { useSelector } from 'react-redux';
import FilterCat from '../FilterCat';
import FilterNum from '../FilterNum';
import SidebarFilterNotUsed from '../SidebarFilterNotUsed';
import SidebarFilterContainer from '../SidebarFilterContainer';
import styles from './SidebarFilter.module.scss';
import { useDisplayMetas, useMetaGroups } from '../../slices/displayInfoAPI';
import { filterViewSelector } from '../../selectors';
import { selectFilterState } from '../../slices/filterSlice';
import useMetaInfo from '../../selectors/useMetaInfo';

interface SidebarFilterProps {
  filter: {
    [key: string]: IFilterState;
  };
  sidebarHeight: number;
  curDisplayInfo: IDisplay;
  filtDist: { [key: string]: CondDistFilterCat | CondDistFilterNum };
  colSplit: {
    cutoff: number | null;
    heights: [number, number];
  };
  handleViewChange: (x: string, which: 'add' | 'remove') => void;
  handleFilterChange: (x: ICategoryFilterState | INumberRangeFilterState) => void;
  handleFilterSortChange: (x: ICategoryFilterState | INumberRangeFilterState) => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filter,
  sidebarHeight,
  curDisplayInfo,
  filtDist,
  colSplit,
  handleViewChange,
  handleFilterChange,
  handleFilterSortChange,
}) => {
  const metas = useDisplayMetas();
  const metaGroups = useMetaGroups();
  const filterView = useSelector(filterViewSelector);
  const filters = useSelector(selectFilterState);
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
  const displId = curDisplayInfo.name;
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
      const meta = metas.find((m) => m.varname === d) as IFactorMeta;
      /* if (filtDist[d]) { */
      /* let filterState = filters[d] as IFilterState;
      let headerExtra = '';
      const filterActive = filterState && filterState.varname !== undefined; */

      let itemContent = <div key={`${d}_${displId}`}>{d}</div>;
      if (meta?.type === 'factor' || meta?.type === 'datetime' || meta?.type === 'date') {
        /* if (!filterState) {
          filterState = {
            name: d,
            orderValue: 'ct,desc',
            type: 'select',
            varType: 'factor',
            value: [],
          };
        } */

        const nlvl = meta?.levels ? meta?.levels.length : 1000;

        itemContent = (
          <FilterCat
            // filterState={filterState as ICategoryFilterState}
            height={Math.min(catHeight, nlvl * 15)}
            dist={curDisplayInfo.metas[d]}
            condDist={filtDist[d] as CondDistFilterCat}
            levels={curDisplayInfo.metas[d].levels}
            handleChange={handleFilterChange}
            handleSortChange={handleFilterSortChange}
          />
        );
        // headerExtra = `${(filtDist[d] as CondDistFilterCat).totSelected} of ${filtDist[d].dist.length}`;
      } else if (meta?.type === 'number') {
        /* if (!filterState) {
          filterState = {
            name: d,
            orderValue: 'ct,desc',
            type: 'range',
            varType: 'numeric',
            valid: false,
          };
        } */

        itemContent = (
          <FilterNum
            name={d}
            // filterState={filterState as INumberRangeFilterState}
            dist={curDisplayInfo.metas[d]}
            condDist={filtDist[d] as CondDistFilterNum}
            handleChange={handleFilterChange}
          />
        );
      }
      return (
        <SidebarFilterContainer
          metas={metas}
          handleViewChange={handleViewChange}
          handleFilterChange={handleFilterChange}
          // filterActive={filterActive}
          // headerExtra={headerExtra}
          displId={displId}
          // filterState={filterState}
          itemContent={itemContent}
          d={d}
          key={`${d}_${displId}`}
        />
      );
      // }
      return '';
    }),
  );

  const extraIdx = colSplit.cutoff === null ? 0 : 1;
  const cogNames = metas.map((m) => m.varname);
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
        metas={metas}
        handleViewChange={handleViewChange}
        inlineStyles={inlineStyles}
        metaGroups={metaGroups}
        inames={inames}
        displId={displId}
        key={displId}
      />,
    );
  }

  return (
    <>
      {filter && filterView.active && colSplit && (
        <div className={styles.sidebarFilterAllContainer} style={inlineStyles.allContainer}>
          <div className={styles.sidebarFilterCol1} style={inlineStyles.col1}>
            {colContent[0]}
          </div>
          <div className={styles.sidebarFilterCol2} style={inlineStyles.col2}>
            {colContent[1]}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarFilter;
