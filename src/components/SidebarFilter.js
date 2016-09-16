import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { emphasize } from 'material-ui/utils/colorManipulator';
import FilterCat from './FilterCat';
import FilterNum from './FilterNum';
import { setFilterView, setFilter, setLayout } from '../actions';
import { cogFiltDistSelector } from '../selectors/cogData';
import { uiConstsSelector, sidebarHeightSelector,
  filterColSplitSelector } from '../selectors/ui';
import { cogInfoSelector } from '../selectors/display';
import { displayInfoSelector, filterStateSelector,
  filterViewSelector } from '../selectors';

const SidebarFilter = ({ style, filter, filterView, cogInfo, displayInfo,
  filtDist, colSplit, handleViewChange, handleFilterChange,
  handleFilterSortChange }) => {
  let content = <div />;
  const displId = displayInfo.info.name;
  if (filter && filterView.active) {
    let col1filters = [];
    let col2filters = [];
    if (colSplit === null) {
      col1filters = filterView.active;
    } else {
      col1filters = filterView.active.slice(0, colSplit);
      col2filters = filterView.active.slice(colSplit, filterView.active.length);
    }
    const colFilters = [col1filters, col2filters];

    const colContent = colFilters.map(curFilters => (
      curFilters.map((d, i) => {
        if (filter[d] && filtDist[d]) {
          let filterState = filter[d];
          let footerExtra = '';
          const filterActive = filterState && filterState.value !== undefined;

          let itemContent = <div key={`${i}_${displId}`}>{d}</div>;
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

            itemContent = (
              <FilterCat
                filterState={filterState}
                style={style.catFilter}
                dist={displayInfo.info.cogDistns[d]}
                condDist={filtDist[d]}
                levels={displayInfo.info.cogInfo[d].levels}
                handleChange={handleFilterChange}
                handleSortChange={handleFilterSortChange}
              />
            );
            footerExtra = `${filtDist[d].totSelected} of ${filtDist[d].dist.length} selected`;
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
                style={style.numFilter}
                dist={displayInfo.info.cogDistns[d]}
                condDist={filtDist[d]}
                handleChange={handleFilterChange}
              />
            );
          }
          return (
            <div key={`${i}_${displId}`} style={style.container}>
              <div style={style.header}>
                <div
                  style={[
                    style.headerName,
                    filterActive && style.headerNameActive
                  ]}
                >
                  {d}
                </div>
                <div style={style.headerExtra}>{footerExtra}</div>
                <div
                  key={`${i}_${displId}-close-icon`}
                  style={[style.headerIcon, style.headerClose]}
                  onMouseDown={() => handleViewChange(d, 'remove')}
                >
                  <i className="icon-times-circle" />
                </div>
                <div
                  key={`${i}_${displId}-reset-icon`}
                  style={[
                    style.headerIcon,
                    style.headerReset,
                    !filterActive && style.headerIconHide]}
                  onMouseDown={() => handleFilterChange(filterState.name)}
                >
                  <i className="icon-undo" />
                </div>
              </div>
              {itemContent}
            </div>
          );
        }
        return '';
      })
    ));

    const extraIdx = colSplit === null ? 0 : 1;
    colContent[extraIdx].push(
      <div key="notUsedHeader" style={style.notUsedHeader}>
        {filterView.active.length === 0 ? 'Select a variable to filter on:' :
          filterView.inactive.length === 0 ? '' : 'More variables:'}
      </div>
    );
    colContent[extraIdx].push(
      <div key="notUsed" style={style.notUsedContainer}>
        {filterView.inactive.map((d, i) => (
          <button
            style={[
              style.variable,
              filter[d] && filter[d].value !== undefined ? style.variableActive : {}
            ]}
            key={`${i}_${displId}`}
            onMouseDown={() => handleViewChange(d, 'add')}
          >
            {d}
          </button>
        ))}
      </div>
    );

    content = (
      <div style={style.allContainer}>
        <div style={style.col1}>
          {colContent[0]}
        </div>
        <div style={style.col2}>
          {colContent[1]}
        </div>
      </div>
    );
  }
  return (content);
};

SidebarFilter.propTypes = {
  style: React.PropTypes.object,
  filter: React.PropTypes.object,
  filterView: React.PropTypes.object,
  cogInfo: React.PropTypes.object,
  displayInfo: React.PropTypes.object,
  filtDist: React.PropTypes.object,
  colSplit: React.PropTypes.number,
  handleViewChange: React.PropTypes.func,
  handleFilterChange: React.PropTypes.func,
  handleFilterSortChange: React.PropTypes.func
};

// ------ redux container ------

// the 'notUsed' and 'variable' styles are reused with SidebarSort - should share
const stateSelector = createSelector(
  uiConstsSelector, filterStateSelector, filterViewSelector,
  cogInfoSelector, sidebarHeightSelector, displayInfoSelector,
  cogFiltDistSelector, filterColSplitSelector,
  (ui, filter, filterView, cogInfo, sh, displayInfo, filtDist, colSplit) => ({
    style: {
      col1: {
        position: 'absolute',
        top: ui.sidebar.header.height,
        left: 0,
        height: sh
      },
      col2: {
        position: 'absolute',
        top: ui.sidebar.header.height,
        left: ui.sidebar.width,
        height: sh,
        borderLeft: `1px solid ${ui.sidebar.borderColor}`,
        display: colSplit === null ? 'none' : 'inline'
      },
      notUsedHeader: {
        height: 30,
        lineHeight: '30px',
        paddingLeft: 10,
        boxSizing: 'border-box',
        width: ui.sidebar.width,
        fontSize: 14
      },
      notUsedContainer: {
        width: ui.sidebar.width,
        // height: sh - 30, // need to take number of filters and total height into account
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
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        border: 0,
        background: 'white',
        margin: 3,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        ':hover': {
          transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
          background: '#ebebeb'
        }
      },
      variableActive: {
        background: '#81C784',
        color: 'white',
        ':hover': {
          background: emphasize('#81C784', 0.2)
        }
      },
      allContainer: {
        width: ui.sidebar.width,
        height: sh,
        boxSizing: 'border-box'
      },
      container: {
        width: ui.sidebar.width,
        // display: 'inline-block',
        // for dropdowns to not be hidden under other elements:
        boxSizing: 'border-box',
        zIndex: 100, // + this.props.index,
        position: 'relative',
        paddingBottom: 6,
        borderBottom: `1px solid ${ui.sidebar.borderColor}`
      },
      header: {
        height: 16,
        lineHeight: '15px',
        width: ui.sidebar.width,
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
        background: '#999',
        color: 'white'
      },
      headerNameActive: {
        background: '#81C784'
      },
      headerIcon: {
        height: 16,
        color: '#666',
        cursor: 'pointer',
        position: 'absolute',
        zIndex: 1000,
        ':hover': {
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
      catFilter: {
        container: {
          width: ui.sidebar.width - (ui.sidebar.filter.margin * 2),
          height: 30 + ui.sidebar.filter.cat.height,
          boxSizing: 'border-box',
          paddingLeft: ui.sidebar.filter.margin,
          paddingRight: ui.sidebar.filter.margin,
          paddingTop: ui.sidebar.filter.margin
        },
        plotContainer: {
          width: ui.sidebar.width - (ui.sidebar.filter.margin * 2),
          height: ui.sidebar.filter.cat.height,
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          userSelect: 'none',
          zIndex: 1000
        },
        inputContainer: {
          width: ui.sidebar.width - (ui.sidebar.filter.margin * 2),
          marginBottom: -14,
          zIndex: 100,
          position: 'relative'
        },
        regexInput: {
          width: ui.sidebar.width - 40,
          marginTop: -8,
          fontSize: 16,
          transform: 'scale(0.85)',
          transformOrigin: '0 0'
        },
        extraOptionsInput: {
          float: 'right',
          width: 28,
          marginTop: -6,
          transform: 'scale(0.85)',
          transformOrigin: '0 0'
        }
      },
      numFilter: {
        container: {
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5
        },
        plotContainer: {
          width: ui.sidebar.width - (ui.sidebar.filter.margin * 2),
          height: ui.sidebar.filter.num.height,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          userSelect: 'none',
          zIndex: 1000
        },
        inputContainer: {
          width: ui.sidebar.width - (ui.sidebar.filter.margin * 2),
          marginBottom: -14,
          zIndex: 100,
          position: 'relative',
          verticalAlign: 'center'
        },
        rangeInputText: {
          fontSize: 13,
          paddingRight: 10,
          display: 'inline-block'
        },
        rangeInput: {
          width: 75,
          marginTop: -10,
          fontSize: 16,
          transform: 'scale(0.85)',
          transformOrigin: '0 0'
        },
        underlineStyle: {
          bottom: 10
        },
        rangeInputInvalid: {
          color: 'red'
        }
      }
    },
    filter,
    filterView,
    cogInfo,
    displayInfo,
    filtDist,
    colSplit
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleViewChange: (x, which) => {
    dispatch(setFilterView(x, which));
  },
  handleFilterChange: (x) => {
    let obj;
    if (typeof x === 'string' || x instanceof String) {
      obj = x;
    } else {
      obj = {};
      obj[x.name] = Object.assign({}, x);
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
)(Radium(SidebarFilter));
