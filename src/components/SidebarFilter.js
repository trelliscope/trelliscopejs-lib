import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import FilterCat from './FilterCat';
import FilterNum from './FilterNum';
import { uiConstsSelector, sidebarHeightSelector } from '../selectors';
import { emphasize } from 'material-ui/utils/colorManipulator';
import { setFilterView, setFilter, setLayout } from '../actions';

const SidebarFilter = ({ style, filter, filterView, cogInfo,
  handleViewChange, handleFilterChange, handleFilterSortChange }) => {
  let content = <div></div>;
  if (filter) {
    content = (
      <div>
        <div style={style.filtersContainer}>
          {filterView.active.map((d, i) => {
            let itemContent = <div key={i}>{d}</div>;
            if (cogInfo[d].type === 'factor') {
              itemContent = (
                <FilterCat
                  filterState={filter[d]}
                  style={style.catFilter}
                  handleChange={handleFilterChange}
                  handleSortChange={handleFilterSortChange}
                />
              );
            } else if (cogInfo[d].type === 'numeric') {
              itemContent = (
                <FilterNum
                  filterState={filter[d]}
                  style={style.numFilter}
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
                    onMouseDown={() => {
                      const view = Object.assign({}, filterView);
                      view.active.splice(view.active.indexOf(d), 1);
                      view.inactive.push(d);
                      handleViewChange(view);
                    }}
                  >
                    <i className="icon-times-circle"></i>
                  </div>
                  <div
                    style={[style.footerIcon, style.footerReset]}
                    // onMouseDown={}
                  >
                    <i className="icon-undo"></i>
                  </div>
                  <div style={style.footerName}>{d}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={style.notUsedContainer}>
          {filterView.inactive.map((d, i) => (
            <div
              style={[
                style.variable,
                filter[d] && filter[d].type ? style.variableActive : {}
              ]}
              key={i}
              onMouseDown={() => {
                const view = Object.assign({}, filterView);
                view.inactive.splice(view.inactive.indexOf(d), 1);
                view.active.push(d);
                handleViewChange(view);
              }}
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
  handleViewChange: React.PropTypes.func,
  handleFilterChange: React.PropTypes.func,
  handleFilterSortChange: React.PropTypes.func
};

// ------ redux container ------

const filterStateSelector = state => state.filter.state;
const filterViewSelector = state => state.filter.view;
const displayInfoSelector = state => state._displayInfo;

const cogInfoSelector = createSelector(
  displayInfoSelector,
  (di) => {
    const res = {};
    for (let i = 0; i < di.info.cogInfo.length; i++) {
      res[di.info.cogInfo[i].name] = di.info.cogInfo[i];
    }
    return (res);
  }
);

// the 'notUsed' and 'variable' styles are reused with SidebarSort - should share
const stateSelector = createSelector(
  uiConstsSelector, filterStateSelector, filterViewSelector,
  cogInfoSelector, sidebarHeightSelector,
  (ui, filter, filterView, cogInfo, sh) => ({
    style: {
      notUsedContainer: {
        width: ui.sidebar.width,
        height: sh - 30,
        overflowY: 'auto',
        boxSizing: 'border-box',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingTop: 5
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
      container: {
        width: ui.sidebar.width - 10,
        // display: 'inline-block',
        // for dropdowns to not be hidden under other elements:
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
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5
        },
        plotContainer: {
          width: ui.sidebar.width - 10,
          height: 90, // make this a variable
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          userSelect: 'none',
          zIndex: 1000
        },
        inputContainer: {
          width: ui.sidebar.width - 10,
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
          width: ui.sidebar.width - 10,
          height: 90, // make this a variable
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          userSelect: 'none',
          zIndex: 1000
        },
        inputContainer: {
          width: ui.sidebar.width - 10,
          marginBottom: -14,
          zIndex: 100,
          position: 'relative'
        },
        rangeInputText: {
          lineHeight: '28px',
          fontSize: 13
        },
        rangeInput: {
          width: 80,
          marginTop: -8,
          fontSize: 16,
          transform: 'scale(0.85)',
          transformOrigin: '0 0'
        }
      }
    },
    filter,
    filterView,
    cogInfo
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleViewChange: (x) => {
    dispatch(setFilterView(x));
  },
  handleFilterChange: (x) => {
    const obj = {};
    obj[x.name] = x;
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
