import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ReactTooltip from 'react-tooltip';
import intersection from 'lodash.intersection';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import FilterCat from './FilterCat';
import FilterNum from './FilterNum';
import {
  setFilterView, setFilter, setLayout, setLabels
} from '../actions';
import { cogFiltDistSelector } from '../selectors/cogData';
import { sidebarHeightSelector, filterColSplitSelector } from '../selectors/ui';
import { cogInfoSelector } from '../selectors/display';
import {
  curDisplayInfoSelector, filterStateSelector,
  filterViewSelector, labelsSelector
} from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

const SidebarFilter = ({
  classes, styles, catHeight, filter, filterView, cogInfo,
  curDisplayInfo, filtDist, colSplit, handleViewChange,
  handleFilterChange, handleFilterSortChange, labels
}) => {
  let content = <div />;
  const displId = curDisplayInfo.info.name;
  const { cogGroups } = curDisplayInfo.info;
  if (filter && filterView.active && colSplit) {
    let col1filters = [];
    let col2filters = [];
    if (colSplit.cutoff === null) {
      col1filters = filterView.active;
    } else {
      col1filters = filterView.active.slice(0, colSplit.cutoff);
      col2filters = filterView.active.slice(colSplit.cutoff, filterView.active.length);
    }
    const colFilters = [col1filters, col2filters];

    const colContent = colFilters.map((curFilters) => (
      curFilters.map((d, i) => {
        if (filtDist[d]) {
          let filterState = filter[d];
          let headerExtra = '';
          const filterActive = filterState && filterState.value !== undefined;

          let itemContent = <div key={`${d}_${displId}`}>{d}</div>;
          if (cogInfo[d].type === 'factor' || cogInfo[d].type === 'time'
            || cogInfo[d].type === 'date') {
            if (!filterState) {
              filterState = {
                name: d,
                orderValue: 'ct,desc',
                type: 'select',
                varType: 'factor'
              };
            }

            const nlvl = cogInfo[d].levels ? cogInfo[d].levels.length : 1000;

            itemContent = (
              <FilterCat
                filterState={filterState}
                height={Math.min(catHeight, nlvl * 15)}
                dist={curDisplayInfo.info.cogDistns[d]}
                condDist={filtDist[d]}
                levels={curDisplayInfo.info.cogInfo[d].levels}
                handleChange={handleFilterChange}
                handleSortChange={handleFilterSortChange}
              />
            );
            headerExtra = `${filtDist[d].totSelected} of ${filtDist[d].dist.length}`;
          } else if (cogInfo[d].type === 'numeric') {
            if (!filterState) {
              filterState = {
                name: d,
                orderValue: 'ct,desc',
                type: 'range',
                varType: 'numeric'
              };
            }

            itemContent = (
              <FilterNum
                name={d}
                filterState={filterState}
                dist={curDisplayInfo.info.cogDistns[d]}
                condDist={filtDist[d]}
                handleChange={handleFilterChange}
              />
            );
          }
          return (
            <div key={`${d}_${displId}`} className={classes.container}>
              <div className={classes.header}>
                <div
                  className={classNames({
                    [classes.headerName]: true,
                    [classes.headerNameActive]: filterActive
                  })}
                >
                  <span data-tip data-for={`hdtooltip_${d}`}>
                    <span className={classes.headerNameText}>{d}</span>
                  </span>
                </div>
                <ReactTooltip place="right" id={`hdtooltip_${d}`}>
                  <span>{cogInfo[d].desc}</span>
                </ReactTooltip>
                <div className={classes.headerExtra}>{headerExtra}</div>
                <button
                  type="button"
                  key={`${d}_${displId}-close-icon`}
                  className={`${classes.headerIcon} ${classes.headerClose}`}
                  onMouseDown={() => handleViewChange(d, 'remove')}
                >
                  <i className="icon-times-circle" />
                </button>
                <button
                  type="button"
                  key={`${d}_${displId}-reset-icon`}
                  className={classNames({
                    [classes.headerIcon]: true,
                    [classes.headerReset]: true,
                    [classes.headerIconHide]: !filterActive
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
      })
    ));

    const extraIdx = colSplit.cutoff === null ? 0 : 1;
    const cogNames = Object.keys(cogInfo);
    const inames = intersection(cogNames, filterView.inactive);
    if (styles.notUsedContainer.height < 170 && extraIdx === 1) {
      colContent[extraIdx].push(
        <div key="notUsedHeader" className={classes.notUsedHeader}>
          Remove filters to select more.
        </div>
      );
    } else {
      colContent[extraIdx].push(
        <div key="notUsedHeader" className={classes.notUsedHeader}>
          {filterView.active.length === 0 ? 'Select a variable to filter on:'
            : filterView.inactive.length === 0 ? '' : 'More variables:'}
        </div>
      );
      colContent[extraIdx].push(
        <div
          key="notUsed"
          className={classes.notUsedContainer}
          style={styles.notUsedContainer}
        >
          {Object.keys(cogGroups).map((grp) => {
            const curItems = intersection(inames, cogGroups[grp]);
            if (curItems.length === 0) {
              return null;
            }
            return (
              <React.Fragment key={grp}>
                {!['condVar', 'common', 'panelKey'].includes(grp) && (
                  <div className={classes.cogGroupHeader}>
                    <span className={classes.cogGroupText}>{`${grp} (${curItems.length})`}</span>
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
                              [classes.variable]: true,
                              [classes.variableActive]: filter[d] && filter[d].value !== undefined
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
        </div>
      );
    }

    content = (
      <div className={classes.allContainer} style={styles.allContainer}>
        <div className={classes.col1} style={styles.col1}>
          {colContent[0]}
        </div>
        <div className={classes.col2} style={styles.col2}>
          {colContent[1]}
        </div>
      </div>
    );
  }
  return (content);
};

SidebarFilter.propTypes = {
  styles: PropTypes.object.isRequired,
  // sheet: PropTypes.object.isRequired,
  catHeight: PropTypes.number.isRequired,
  filter: PropTypes.object.isRequired,
  filterView: PropTypes.object.isRequired,
  cogInfo: PropTypes.object.isRequired,
  curDisplayInfo: PropTypes.object.isRequired,
  filtDist: PropTypes.object.isRequired,
  colSplit: PropTypes.object.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  handleFilterSortChange: PropTypes.func.isRequired,
  labels: PropTypes.array.isRequired
};

// ------ static styles ------

// the 'notUsed', 'variable', 'cogGroupHeader', 'cogGroupText'
// styles are reused with SidebarSort - should share
const staticStyles = {
  col1: {
    position: 'absolute',
    top: uiConsts.sidebar.header.height,
    left: 0
  },
  col2: {
    position: 'absolute',
    top: uiConsts.sidebar.header.height,
    left: uiConsts.sidebar.width,
    borderLeft: `1px solid ${uiConsts.sidebar.borderColor}`
  },
  notUsedHeader: {
    height: 30,
    lineHeight: '30px',
    paddingLeft: 10,
    boxSizing: 'border-box',
    width: uiConsts.sidebar.width,
    fontSize: 14
  },
  notUsedContainer: {
    width: uiConsts.sidebar.width,
    overflowY: 'auto',
    boxSizing: 'border-box',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  variable: {
    display: 'inline-block',
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
    borderRadius: 10,
    paddingTop: '2px !important',
    paddingBottom: '3px !important',
    paddingLeft: '7px !important',
    paddingRight: '7px !important',
    border: 0,
    background: 'white',
    margin: '3px !important',
    fontSize: 12,
    cursor: 'pointer',
    color: 'black',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    '&:hover': {
      transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      background: '#ebebeb'
    }
  },
  variableActive: {
    background: '#81C784',
    color: 'white',
    '&:hover': {
      background: emphasize('#81C784', 0.2)
    }
  },
  allContainer: {
    width: uiConsts.sidebar.width,
    boxSizing: 'border-box'
  },
  container: {
    width: uiConsts.sidebar.width,
    // display: 'inline-block',
    // for dropdowns to not be hidden under other elements:
    boxSizing: 'border-box',
    zIndex: 100, // + this.props.index,
    position: 'relative',
    paddingBottom: 6,
    borderBottom: `1px solid ${uiConsts.sidebar.borderColor}`
  },
  header: {
    height: 16,
    lineHeight: '15px',
    width: uiConsts.sidebar.width,
    marginTop: 1,
    fontSize: 12,
    position: 'relative'
  },
  headerExtra: {
    position: 'absolute',
    right: 38,
    height: 16,
    lineHeight: '15px',
    fontSize: 11,
    color: '#777'
  },
  headerName: {
    height: 16,
    paddingLeft: 5,
    paddingRight: 5,
    position: 'absolute',
    left: 1,
    userSelect: 'none',
    cursor: 'default',
    background: '#999'
  },
  headerNameActive: {
    background: '#81C784'
  },
  headerNameText: {
    color: 'white'
  },
  headerIcon: {
    height: 16,
    color: '#666',
    cursor: 'pointer',
    position: 'absolute',
    border: 'none',
    background: 'none',
    marginTop: -1,
    padding: 0,
    zIndex: 1000,
    '&:hover': {
      transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      color: '#aaa'
    }
  },
  headerIconHide: {
    visibility: 'hidden'
  },
  headerClose: {
    right: 5
  },
  headerReset: {
    right: 18
  },
  cogGroupHeader: {
    background: '#90CAF9',
    marginLeft: -10,
    marginRight: -10,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5,
    color: 'white',
    fontWeight: 400,
    fontSize: 14
  },
  cogGroupText: {
    paddingLeft: 20
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  filterStateSelector, filterViewSelector,
  cogInfoSelector, sidebarHeightSelector, curDisplayInfoSelector,
  cogFiltDistSelector, filterColSplitSelector, labelsSelector,
  (filter, filterView, cogInfo, sh, curDisplayInfo, filtDist, colSplit, labels) => ({
    styles: {
      col1: {
        height: sh
      },
      col2: {
        height: sh,
        display: colSplit.cutoff === null ? 'none' : 'inline'
      },
      notUsedContainer: {
        height: sh - 35 - colSplit.heights[colSplit.cutoff === null ? 0 : 1]
      },
      allContainer: {
        height: sh
      }
    },
    catHeight: uiConsts.sidebar.filter.cat.height,
    filter,
    filterView,
    cogInfo,
    curDisplayInfo,
    filtDist,
    colSplit,
    labels
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleViewChange: (x, which, labels) => {
    // if a filter is being added to the view, add a panel label for the variable
    if (which === 'add') {
      if (labels.indexOf(x) < 0) {
        const newLabels = Object.assign([], labels);
        newLabels.push(x);
        dispatch(setLabels(newLabels));
      }
    }
    dispatch(setFilterView(x, which));
  },
  handleFilterChange: (x) => {
    let obj;
    if (typeof x === 'string' || x instanceof String) {
      obj = x;
    } else {
      obj = {};
      obj[x.name] = { ...x };
    }
    dispatch(setFilter(obj));
    dispatch(setLayout({ pageNum: 1 }));
  },
  handleFilterSortChange: (x) => {
    const obj = {};
    obj[x.name] = x;
    dispatch(setFilter(obj));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(SidebarFilter));
