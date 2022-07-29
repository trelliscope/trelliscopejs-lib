import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ReactTooltip from 'react-tooltip';
import intersection from 'lodash.intersection';
// import Fab from '@material-ui/core/Button';
// import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { setSort, setLabels, setLayout } from '../actions';
import { sidebarHeightSelector } from '../selectors/ui';
import { sortSelector, curDisplayInfoSelector, labelsSelector } from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

const SidebarSort = ({
  classes, styles, sort, cogDesc, labels, handleChange, addLabel, curDisplayInfo
}) => {
  let content = <div />;
  const { cogGroups } = curDisplayInfo.info;
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
        <div className={classes.tableWrap} style={styles.tableWrap}>
          <table className={classes.table}>
            <tbody>
              {sort.map((d, i) => {
                const ic = d.dir === 'asc' ? 'up' : 'down';
                return (
                  <tr className={classes.tr} key={`${d.name}_tr`}>
                    <td className={classes.sortButton}>
                      <IconButton
                        // style={{ width: 36, height: 30 }}
                        color="primary"
                        key={`${d.name}_button`}
                        onClick={() => {
                          const sort2 = Object.assign([], sort);
                          sort2[i].dir = sort2[i].dir === 'asc' ? 'desc' : 'asc';
                          handleChange(sort2);
                        }}
                      >
                        <i className={`icon-chevron-${ic}`} style={{ fontSize: 16 }} />
                      </IconButton>
                    </td>
                    <td className={classes.labels}>
                      {d.name}
                      <br />
                      <span style={{ color: '#888', fontStyle: 'italic' }}>
                        {cogDesc[d.name]}
                      </span>
                    </td>
                    <td className={classes.closeButton}>
                      <IconButton onClick={() => handleChange(i)}>
                        <Icon className="icon-times" style={{ fontSize: 16, color: '#aaa' }} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={classes.notUsedHeader}>
          {sort.length === 0 ? 'Select a variable to sort on:'
            : notUsed.length === 0 ? '' : 'More variables:'}
        </div>
        <div className={classes.notUsed} style={styles.notUsed}>
          {Object.keys(cogGroups).map((grp) => {
            const curItems = intersection(notUsed, cogGroups[grp]);
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
                {curItems.sort().map((d) => (
                  <span key={`${d}_notused`}>
                    <span data-tip data-for={`tooltip_${d}`}>
                      <button
                        type="button"
                        className={classes.variable}
                        key={`${d}_button`}
                        onClick={() => {
                          const sort2 = Object.assign([], sort);
                          sort2.push({ name: d, dir: 'asc' });
                          addLabel(d, labels);
                          handleChange(sort2);
                        }}
                      >
                        {d}
                      </button>
                    </span>
                    <ReactTooltip place="right" id={`tooltip_${d}`}>
                      <span>{cogDesc[d]}</span>
                    </ReactTooltip>
                  </span>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
  return (content);
};

SidebarSort.propTypes = {
  styles: PropTypes.object.isRequired,
  sort: PropTypes.array.isRequired,
  cogDesc: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  addLabel: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  tableWrap: {
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  table: {
    width: uiConsts.sidebar.width - 5,
    borderCollapse: 'collapse',
    borderSpacing: 0,
    tableLayout: 'fixed'
  },
  tr: {
    width: uiConsts.sidebar.width - 5,
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
    width: uiConsts.sidebar.width - 45 - 45 - 5,
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
    width: uiConsts.sidebar.width,
    fontSize: 14
  },
  notUsed: {
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
    border: 0,
    background: 'none',
    paddingTop: '2px !important',
    paddingBottom: '3px !important',
    paddingLeft: '7px !important',
    paddingRight: '7px !important',
    margin: '3px !important',
    fontSize: 12,
    color: 'black',
    cursor: 'pointer',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    '&:hover': {
      transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      background: '#ebebeb'
    }
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

const cogDescSelector = createSelector(
  curDisplayInfoSelector,
  (cdi) => {
    const res = {};
    const ciKeys = Object.keys(cdi.info.cogInfo);
    for (let i = 0; i < ciKeys.length; i += 1) {
      res[ciKeys[i]] = cdi.info.cogInfo[ciKeys[i]].desc;
    }
    return (res);
  }
);

const stateSelector = createSelector(
  sortSelector, cogDescSelector, sidebarHeightSelector, labelsSelector, curDisplayInfoSelector,
  (sort, cogDesc, sh, labels, cdi) => {
    const activeIsTaller = sort.length * 51 > sh - (2 * 51);
    let activeHeight = 51 * sort.length;
    if (activeIsTaller) {
      const n = Math.ceil((sh * 0.6) / 51);
      activeHeight = (n * 51) - 25;
    }
    return ({
      styles: {
        tableWrap: {
          maxHeight: activeHeight
        },
        notUsed: {
          height: sh - activeHeight - 30
        }
      },
      sort,
      cogDesc,
      labels,
      curDisplayInfo: cdi
    });
  }
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (sortSpec) => {
    dispatch(setSort(sortSpec));
    dispatch(setLayout({ pageNum: 1 }));
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
)(injectSheet(staticStyles)(SidebarSort));
