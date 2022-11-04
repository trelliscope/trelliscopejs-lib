import React from 'react';
import type { CSSProperties } from 'react';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import { connect } from 'react-redux';
import intersection from 'lodash.intersection';
import type { Action, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import FilterCat from '../FilterCat';
import FilterNum from '../FilterNum';
import { cogFiltDistSelector } from '../../selectors/cogData';
import { sidebarHeightSelector, filterColSplitSelector } from '../../selectors/ui';
import { cogInfoSelector } from '../../selectors/display';
import { curDisplayInfoSelector, filterStateSelector, filterViewSelector, labelsSelector } from '../../selectors';
import { setFilter, setFilterView } from '../../slices/filterSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import styles from './SidebarFilter.module.scss';

interface SidebarFilterProps {
  inlineStyles: { [key: string]: CSSProperties };
  catHeight: number;
  filter: { [key: string]: Filter<FilterCat | FilterRange> };
  filterView: FilterView;
  handleFilterChange: (filter: Filter<FilterCat | FilterRange> | string) => void;
  handleFilterSortChange: (filter: Filter<FilterCat>) => void;
  handleViewChange: (x: string, which: 'add' | 'remove', labels: string[]) => void;
  labels: string[];
  cogInfo: { [key: string]: CogInfo };
  curDisplayInfo: CurrentDisplayInfo;
  filtDist: { [key: string]: CondDistFilterCat | CondDistFilterNum };
  colSplit: { cutoff: number | null; heights: [number, number] };
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  inlineStyles,
  catHeight,
  filter,
  filterView,
  cogInfo,
  curDisplayInfo,
  filtDist,
  colSplit,
  handleViewChange,
  handleFilterChange,
  handleFilterSortChange,
  labels,
}) => {
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
      curFilters.map((d) => {
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
            <div key={`${d}_${displId}`} className={styles.container}>
              <div className={styles.header}>
                <div
                  className={classNames({
                    [styles.headerName]: true,
                    [styles.headerNameActive]: filterActive,
                  })}
                >
                  <span data-tip data-for={`hdtooltip_${d}`}>
                    <span className={styles.headerNameText}>{d}</span>
                  </span>
                </div>
                <ReactTooltip place="right" id={`hdtooltip_${d}`}>
                  <span>{cogInfo[d].desc}</span>
                </ReactTooltip>
                <div className={styles.headerExtra}>{headerExtra}</div>
                <button
                  type="button"
                  key={`${d}_${displId}-close-icon`}
                  className={`${styles.headerIcon} ${styles.headerClose}`}
                  onMouseDown={() => handleViewChange(d, 'remove', [])}
                >
                  <i className="icon-times-circle" />
                </button>
                <button
                  type="button"
                  key={`${d}_${displId}-reset-icon`}
                  className={classNames({
                    [styles.headerIcon]: true,
                    [styles.headerReset]: true,
                    [styles.headerIconHide]: !filterActive,
                  })}
                  onMouseDown={() => handleFilterChange(filterState.name)}
                >
                  <i className="icon-undo" />
                </button>
              </div>
              {itemContent}
            </div>
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
        <div key="notUsedHeader" className={styles.notUsedHeader}>
          Remove filters to select more.
        </div>,
      );
    } else {
      colContent[extraIdx].push(
        <div key="notUsedHeader" className={styles.notUsedHeader}>
          {filterView.active.length === 0
            ? 'Select a variable to filter on:'
            : filterView.inactive.length === 0
            ? ''
            : 'More variables:'}
        </div>,
      );
      colContent[extraIdx].push(
        <div key="notUsed" className={styles.notUsedContainer} style={inlineStyles.notUsedContainer}>
          {Object.keys(cogGroups).map((grp) => {
            const curItems = intersection(inames, cogGroups[grp]);
            if (curItems.length === 0) {
              return null;
            }
            return (
              <React.Fragment key={grp}>
                {!['condVar', 'common', 'panelKey'].includes(grp) && (
                  <div className={styles.cogGroupHeader}>
                    <span className={styles.cogGroupText}>{`${grp} (${curItems.length})`}</span>
                  </div>
                )}
                {cogGroups[grp].sort().map((d) => (
                  <React.Fragment key={`${d}_${displId}`}>
                    {inames.includes(d) && (
                      <span>
                        <span data-tip data-for={`tooltip_${d}`}>
                          <button
                            type="button"
                            className={classNames({
                              [styles.variable]: true,
                              [styles.variableActive]: filter[d] && filter[d].value !== undefined,
                            })}
                            key={`${d}_${displId}_button_${inames.length}`}
                            onClick={() => handleViewChange(d, 'add', labels)}
                          >
                            {d}
                          </button>
                        </span>
                        <ReactTooltip place="right" id={`tooltip_${d}`}>
                          <span>{cogInfo[d].desc}</span>
                        </ReactTooltip>
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            );
          })}
        </div>,
      );
    }

    content = (
      <div className={styles.allContainer} style={inlineStyles.allContainer}>
        <div className={styles.col1} style={inlineStyles.col1}>
          {colContent[0]}
        </div>
        <div className={styles.col2} style={inlineStyles.col2}>
          {colContent[1]}
        </div>
      </div>
    );
  }
  return content;
};

const stateSelector = createSelector(
  filterStateSelector,
  filterViewSelector,
  cogInfoSelector,
  sidebarHeightSelector,
  curDisplayInfoSelector,
  cogFiltDistSelector,
  labelsSelector,
  filterColSplitSelector,
  (filter, filterView, cogInfo, sh, curDisplayInfo, filtDist, labels, colSplit) => ({
    inlineStyles: {
      col1: {
        height: sh,
      },
      col2: {
        height: sh,
        display: colSplit.cutoff === null ? 'none' : 'inline',
      },
      notUsedContainer: {
        height: sh - 35 - colSplit.heights[colSplit.cutoff === null ? 0 : 1],
      },
      allContainer: {
        height: sh,
      },
    },
    catHeight: 125,
    filter,
    filterView,
    cogInfo,
    curDisplayInfo,
    filtDist,
    labels,
    colSplit,
  }),
);

const mapStateToProps = (state: never) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleViewChange: (x: string, which: 'add' | 'remove', labels: string[]) => {
    // if a filter is being added to the view, add a panel label for the variable
    if (which === 'add') {
      if (labels.indexOf(x) < 0) {
        const newLabels = Object.assign([], labels);
        newLabels.push(x);
        dispatch(setLabels(newLabels));
      }
    }
    dispatch(setFilterView({ name: x, which }));
  },
  handleFilterChange: (x: Filter<FilterCat | FilterRange> | string) => {
    if (typeof x === 'string' || x instanceof String) {
      dispatch(setFilter(x as string));
    } else {
      const obj: { [key: string]: Filter<FilterCat | FilterRange> } = {};
      obj[x.name] = { ...x } as Filter<FilterCat | FilterRange>;
      dispatch(setFilter(obj));
    }
    dispatch(setLayout({ pageNum: 1 }));
  },
  handleFilterSortChange: (x: Filter<FilterCat>) => {
    const obj: { [key: string]: Filter<FilterCat> } = {};
    obj[x.name] = x;
    dispatch(setFilter(obj));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilter);
