import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import FilterCat from './FilterCat';
import { uiConstsSelector, sidebarHeightSelector } from '../selectors';
import { emphasize } from 'material-ui/utils/colorManipulator';

const SidebarFilter = ({ style, filter, cogInfo }) => {
  let content = <div></div>;
  if (filter) {
    const notUsed = Object.keys(cogInfo);
    for (let i = 0; i < filter.length; i++) {
      const index = notUsed.indexOf(filter[i].name);
      if (index > -1) {
        notUsed.splice(index, 1);
      }
    }
    content = (
      <div>
        <div style={style.filtersContainer}>
          {filter.map((d, i) => {
            let itemContent = <div key={i}>{d.name}</div>;
            if (cogInfo[d.name].type === 'factor') {
              itemContent = (
                <FilterCat
                  style={style.catFilter}
                  key={i}
                  cogName={d.name}
                />
              );
            }
            return itemContent;
          })}
        </div>
        <div style={style.notUsedContainer}>
          {notUsed.map((d, i) => (
            <div
              style={style.variable}
              key={i}
              onClick={() => {}}
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
  filter: React.PropTypes.array,
  cogInfo: React.PropTypes.object
};

// ------ redux container ------

const filterSelector = state => state.filter;
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
  uiConstsSelector, filterSelector, cogInfoSelector, sidebarHeightSelector,
  (ui, filter, cogInfo, sh) => ({
    style: {
      notUsedContainer: {
        width: ui.sidebar.width,
        height: sh - 30,
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
        background: '#ffa500',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        ':hover': {
          transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
          background: emphasize('#ffa500', 0.4)
        }
      },
      catFilter: {
        container: {
          width: ui.sidebar.width - 10,
          // display: 'inline-block',
          // for dropdowns to not be hidden under other elements:
          zIndex: 100, // + this.props.index,
          position: 'relative'
        },
        innerContainer: {
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
        }
      }
    },
    filter,
    cogInfo
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(Radium(SidebarFilter));
