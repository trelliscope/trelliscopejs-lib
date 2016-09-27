import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import ReactTooltip from 'react-tooltip';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import { setSort, setLabels } from '../actions';
import { uiConstsSelector, sidebarHeightSelector } from '../selectors/ui';
import { sortSelector, displayInfoSelector, labelsSelector } from '../selectors';

const SidebarSort = ({ style, sort, cogDesc, labels, handleChange, addLabel }) => {
  let content = <div />;
  if (cogDesc) {
    const notUsed = Object.keys(cogDesc);
    for (let i = 0; i < sort.length; i += 1) {
      const index = notUsed.indexOf(sort[i].name);
      if (index > -1) {
        notUsed.splice(index, 1);
      }
    }
    content = (
      <div>
        <div style={style.tableWrap}>
          <table style={style.table}>
            <tbody>
              {sort.map((d, i) => {
                const ic = d.dir === 'asc' ? 'up' : 'down';
                return (
                  <tr style={style.tr} key={i}>
                    <td style={style.sortButton}>
                      <FloatingActionButton
                        mini
                        key={i}
                        zDepth={1}
                        onClick={() => {
                          const sort2 = Object.assign([], sort);
                          sort2[i].dir = sort2[i].dir === 'asc' ? 'desc' : 'asc';
                          handleChange(sort2);
                        }}
                      >
                        <i className={`icon-chevron-${ic}`} />
                      </FloatingActionButton>
                    </td>
                    <td style={style.labels}>
                      {d.name}<br />
                      <span style={{ color: '#888', fontStyle: 'italic' }}>
                        {cogDesc[d.name]}
                      </span>
                    </td>
                    <td style={style.closeButton}>
                      <IconButton
                        iconStyle={{ fontSize: 16, color: '#aaa' }}
                        iconClassName="icon-times"
                        onClick={() => handleChange(i)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={style.notUsedHeader}>
          {sort.length === 0 ? 'Select a variable to sort on:' :
            notUsed.length === 0 ? '' : 'More variables:'}
        </div>
        <div style={style.notUsed}>
          {notUsed.map((d, i) => (
            <span key={i}>
              <a data-tip data-for={`tooltip_${d}`}>
                <button
                  style={style.variable}
                  key={`button_${i}`}
                  onClick={() => {
                    const sort2 = Object.assign([], sort);
                    sort2.push({ name: d, dir: 'asc' });
                    addLabel(d, labels);
                    handleChange(sort2);
                  }}
                >
                  {d}
                </button>
              </a>
              <ReactTooltip place="right" id={`tooltip_${d}`}>
                <span>{cogDesc[d]}</span>
              </ReactTooltip>
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (content);
};

SidebarSort.propTypes = {
  style: React.PropTypes.object,
  sort: React.PropTypes.array,
  cogDesc: React.PropTypes.object,
  labels: React.PropTypes.array,
  handleChange: React.PropTypes.func,
  addLabel: React.PropTypes.func
};

// ------ redux container ------

const cogDescSelector = createSelector(
  displayInfoSelector,
  (di) => {
    const res = {};
    const ciKeys = Object.keys(di.info.cogInfo);
    for (let i = 0; i < ciKeys.length; i += 1) {
      res[ciKeys[i]] = di.info.cogInfo[ciKeys[i]].desc;
    }
    return (res);
  }
);

const stateSelector = createSelector(
  uiConstsSelector, sortSelector, cogDescSelector, sidebarHeightSelector, labelsSelector,
  (ui, sort, cogDesc, sh, labels) => {
    const activeIsTaller = sort.length * 51 > sh - (2 * 51);
    let activeHeight = 51 * sort.length;
    if (activeIsTaller) {
      const n = Math.ceil((sh * 0.6) / 51);
      activeHeight = (n * 51) - 25;
    }
    return ({
      style: {
        tableWrap: {
          maxHeight: activeHeight,
          overflowY: 'auto',
          overflowX: 'hidden'
        },
        table: {
          width: ui.sidebar.width - 5,
          borderCollapse: 'collapse',
          borderSpacing: 0,
          tableLayout: 'fixed'
        },
        tr: {
          width: ui.sidebar.width - 5,
          height: 48,
          borderBottom: '1px solid rgb(224, 224, 224)'
        },
        sortButton: {
          verticalAlign: 'middle',
          width: 45,
          textAlign: 'center'
        },
        labels: {
          fontSize: 13,
          height: 48,
          width: ui.sidebar.width - 45 - 45 - 5,
          verticalAlign: 'middle',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        },
        closeButton: {
          height: 48,
          width: 45,
          textAlign: 'center',
          verticalAlign: 'middle'
        },
        notUsedHeader: {
          height: 30,
          lineHeight: '30px',
          paddingLeft: 10,
          boxSizing: 'border-box',
          width: ui.sidebar.width,
          fontSize: 14
        },
        notUsed: {
          width: ui.sidebar.width,
          height: sh - activeHeight - 30,
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
          border: 0,
          background: 'none',
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: 10,
          paddingRight: 10,
          margin: 3,
          fontSize: 13,
          cursor: 'pointer',
          transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
          ':hover': {
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            background: '#ebebeb'
          }
        }
      },
      sort,
      cogDesc,
      labels
    });
  }
);

const mapStateToProps = state => (
  stateSelector(state)
);

const mapDispatchToProps = dispatch => ({
  handleChange: (layout) => {
    dispatch(setSort(layout));
  },
  addLabel: (name, labels) => {
    // if a sort variable is being added, add a panel label for the variable
    if (labels.indexOf(name) < 0) {
      const newLabels = Object.assign([], labels);
      newLabels.push(name);
      dispatch(setLabels(newLabels));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(SidebarSort));

