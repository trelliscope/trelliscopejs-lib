import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ReactTooltip from 'react-tooltip';
import intersection from 'lodash.intersection';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { setSort, setLabels, setLayout } from '../../actions';
import { sidebarHeightSelector } from '../../selectors/ui';
import { sortSelector, curDisplayInfoSelector, labelsSelector } from '../../selectors';
import styles from './SidebarSort.module.scss';

const SidebarSort = ({ customStyles, sort, cogDesc, labels, handleChange, addLabel, curDisplayInfo }) => {
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
        <div className={styles.sidebarSortTableWrap} style={customStyles.tableWrap}>
          <table className={styles.sidebarSortTable}>
            <tbody>
              {sort.map((d, i) => {
                const ic = d.dir === 'asc' ? 'up' : 'down';
                return (
                  <tr className={styles.sidebarSortTableRow} key={`${d.name}_tr`}>
                    <td className={styles.sidebarSortButton}>
                      <IconButton
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
                    <td className={styles.sidebarSortLabels}>
                      {d.name}
                      <br />
                      <span style={{ color: '#888', fontStyle: 'italic' }}>{cogDesc[d.name]}</span>
                    </td>
                    <td className={styles.sidebarSortButtonClose}>
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
        <div className={styles.sidebarSortNotUsedHeader}>
          {sort.length === 0 ? 'Select a variable to sort on:' : notUsed.length === 0 ? '' : 'More variables:'}
        </div>
        <div className={styles.sidebarSortNotUsed} style={customStyles.notUsed}>
          {Object.keys(cogGroups).map((grp) => {
            const curItems = intersection(notUsed, cogGroups[grp]);
            if (curItems.length === 0) {
              return null;
            }
            return (
              <React.Fragment key={grp}>
                {!['condVar', 'common', 'panelKey'].includes(grp) && (
                  <div className={styles.sidebarSortCogGroupHeader}>
                    <span className={styles.sidebarSortCogGroupText}>{`${grp} (${curItems.length})`}</span>
                  </div>
                )}
                {curItems.sort().map((d) => (
                  <span key={`${d}_notused`}>
                    <span data-tip data-for={`tooltip_${d}`}>
                      <button
                        type="button"
                        className={styles.sidebarSortVariable}
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
  return content;
};

SidebarSort.propTypes = {
  customStyles: PropTypes.object.isRequired,
  sort: PropTypes.array.isRequired,
  cogDesc: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  addLabel: PropTypes.func.isRequired,
};

// ------ redux container ------

const cogDescSelector = createSelector(curDisplayInfoSelector, (cdi) => {
  const res = {};
  const ciKeys = Object.keys(cdi.info.cogInfo);
  for (let i = 0; i < ciKeys.length; i += 1) {
    res[ciKeys[i]] = cdi.info.cogInfo[ciKeys[i]].desc;
  }
  return res;
});

const stateSelector = createSelector(
  sortSelector,
  cogDescSelector,
  sidebarHeightSelector,
  labelsSelector,
  curDisplayInfoSelector,
  (sort, cogDesc, sh, labels, cdi) => {
    const activeIsTaller = sort.length * 51 > sh - 2 * 51;
    let activeHeight = 51 * sort.length;
    if (activeIsTaller) {
      const n = Math.ceil((sh * 0.6) / 51);
      activeHeight = n * 51 - 25;
    }
    return {
      customStyles: {
        tableWrap: {
          maxHeight: activeHeight,
        },
        notUsed: {
          height: sh - activeHeight - 30,
        },
      },
      sort,
      cogDesc,
      labels,
      curDisplayInfo: cdi,
    };
  },
);

const mapStateToProps = (state) => stateSelector(state);

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
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarSort);
