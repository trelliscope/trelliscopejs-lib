import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { emphasize } from 'material-ui/utils/colorManipulator';
import FilterCat from './FilterCat';
import FilterNum from './FilterNum';
import { setFilterView, setFilter, setLayout } from '../actions';
import { cogFiltDistSelector } from '../selectors/cogData';
import { uiConstsSelector, sidebarHeightSelector } from '../selectors/ui';
import { cogInfoSelector } from '../selectors/display';
import { displayInfoSelector, filterStateSelector,
  filterViewSelector } from '../selectors';

const SidebarFilter = ({ style, filter, filterView, cogInfo, displayInfo,
  filtDist, handleViewChange, handleFilterChange, handleFilterSortChange }) => {
  let content = <div />;
  if (filter) {
    content = (
      <div style={style.allContainer}>
        <div style={style.filtersContainer}>
          {filterView.active.map((d, i) => {
            let filterState = filter[d];
            let handleReset = () => (undefined);

            let itemContent = <div key={i}>{d}</div>;
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

              handleReset = () => {
                const newState = {
                  name: filterState.name,
                  varType: filterState.varType,
                  orderValue: filterState.orderValue
                };
                handleFilterChange(newState);
              };

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
              <div key={i} style={style.container}>
                {itemContent}
                <div style={style.footer}>
                  <div
                    style={[style.footerIcon, style.footerClose]}
                    onMouseDown={() => handleViewChange(d, 'remove')}
                  >
                    <i className="icon-times-circle" />
                  </div>
                  <div
                    style={[style.footerIcon, style.footerReset]}
                    onMouseDown={handleReset}
                  >
                    <i className="icon-undo" />
                  </div>
                  <div style={style.footerName}>{d}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={style.notUsedHeader}>
          {filterView.active.length === 0 ? 'Select a variable to filter on:' :
            filterView.inactive.length === 0 ? '' : 'More variables:'}
        </div>
        <div style={style.notUsedContainer}>
          {filterView.inactive.map((d, i) => (
            <div
              style={[
                style.variable,
                filter[d] && filter[d].value !== undefined ? style.variableActive : {}
              ]}
              key={i}
              onMouseDown={() => handleViewChange(d, 'add')}
            >
              {d}
            </div>
          ))}
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
  handleViewChange: React.PropTypes.func,
  handleFilterChange: React.PropTypes.func,
  handleFilterSortChange: React.PropTypes.func
};

// ------ redux container ------

// the 'notUsed' and 'variable' styles are reused with SidebarSort - should share
const stateSelector = createSelector(
  uiConstsSelector, filterStateSelector, filterViewSelector,
  cogInfoSelector, sidebarHeightSelector, displayInfoSelector,
  cogFiltDistSelector,
  (ui, filter, filterView, cogInfo, sh, displayInfo, filtDist) => ({
    style: {
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
        borderRadius: 10,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 2,
        fontSize: 13,
        background: emphasize('#ffa500', 0.3),
        color: 'white',
        cursor: 'pointer',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        ':hover': {
          transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
          background: emphasize('#ffa500', 0.5)
        }
      },
      variableActive: {
        background: '#ffa500',
        ':hover': {
          background: emphasize('#ffa500', 0.2)
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
        position: 'relative'
      },
      footer: {
        height: 16,
        lineHeight: '15px',
        width: ui.sidebar.width,
        borderBottom: '1px solid #ddd', // make this a variable
        marginTop: 5,
        fontSize: 12,
        position: 'relative',
        background: '#f8f8f8' // make this a variable
      },
      footerName: {
        height: 16,
        paddingLeft: 5,
        paddingRight: 5,
        position: 'absolute',
        right: 0,
        userSelect: 'none',
        cursor: 'default',
        background: 'lightgray'
      },
      footerIcon: {
        height: 16,
        color: '#666',
        cursor: 'pointer',
        position: 'absolute',
        zIndex: 1000
      },
      footerClose: {
        left: 5
      },
      footerReset: {
        left: 18
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
          height: 90, // make this a variable
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
    filtDist
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
    const obj = {};
    obj[x.name] = Object.assign({}, x);
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
