import React from 'react';
import type { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ReactTooltip from 'react-tooltip';
import intersection from 'lodash.intersection';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { setSort } from '../../slices/sortSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import { sidebarHeightSelector } from '../../selectors/ui';
import { sortSelector, curDisplayInfoSelector, labelsSelector } from '../../selectors';
import type { RootState } from '../../store';
import styles from './SidebarSort.module.scss';

interface SidebarSortProps {
  customStyles: {
    tableWrap: {
      maxHeight: number;
    };
    notUsed: {
      height: number;
    };
  };
  sort: Sort[];
  cogDesc: {
    label: string;
    value: string;
    index: string;
    [key: string]: string;
  };
  labels: string[];
  handleChange: (arg1: Sort[] | number) => void;
  addLabel: (name: string, label: string[]) => void;
  curDisplayInfo: CurrentDisplayInfo;
}

const SidebarSort: React.FC<SidebarSortProps> = ({
  customStyles,
  sort,
  cogDesc,
  labels,
  handleChange,
  addLabel,
  curDisplayInfo,
}) => {
  let content = <div />;
  const { cogGroups } = curDisplayInfo.info;
  const sort2 = Object.assign([], sort) as Sort[];
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
                {curItems.sort().map((d: string) => (
                  <span key={`${d}_notused`}>
                    <span data-tip data-for={`tooltip_${d}`}>
                      <button
                        type="button"
                        className={styles.sidebarSortVariable}
                        key={`${d}_button`}
                        onClick={() => {
                          const order = sort.length === 0 ? 1 : sort[sort.length - 1].order + 1;
                          sort2.push({ name: d, dir: 'asc', order });
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

// ------ redux container ------

const cogDescSelector = createSelector(curDisplayInfoSelector, (cdi) => {
  const res: { [key: string]: string; label: string; value: string; index: string } = {
    label: '',
    value: '',
    index: '',
  };
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

const mapStateToProps = (state: RootState) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleChange: (sortSpec: Sort[] | number) => {
    dispatch(setSort(sortSpec));
    dispatch(setLayout({ pageNum: 1 }));
  },
  addLabel: (name: string, labels: string[]) => {
    // if a sort variable is being added, add a panel label for the variable
    if (labels.indexOf(name) < 0) {
      const newLabels = Object.assign([], labels);
      newLabels.push(name);
      dispatch(setLabels(newLabels));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarSort);
