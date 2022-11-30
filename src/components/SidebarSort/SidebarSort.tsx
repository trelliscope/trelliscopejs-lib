import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactTooltip from 'react-tooltip';
import intersection from 'lodash.intersection';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { setSort } from '../../slices/sortSlice';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import { sidebarHeightSelector } from '../../selectors/ui';
import { sortSelector, curDisplayInfoSelector, labelsSelector, cogDescSelector } from '../../selectors';
import styles from './SidebarSort.module.scss';

const SidebarSort: React.FC = () => {
  const dispatch = useDispatch();
  const sort = useSelector(sortSelector);
  const cogDesc = useSelector(cogDescSelector);
  const sidebarHeight = useSelector(sidebarHeightSelector);
  const labels = useSelector(labelsSelector);
  const curDisplayInfo = useSelector(curDisplayInfoSelector);

  const activeIsTaller = sort.length * 51 > sidebarHeight - 2 * 51;
  let activeHeight = 51 * sort.length;
  if (activeIsTaller) {
    const n = Math.ceil((sidebarHeight * 0.6) / 51);
    activeHeight = n * 51 - 25;
  }
  const customStyles = {
    tableWrap: {
      maxHeight: activeHeight,
    },
    notUsed: {
      height: sidebarHeight - activeHeight - 30,
    },
  };

  const handleChange = (sortSpec: Sort[] | number) => {
    dispatch(setSort(sortSpec));
    dispatch(setLayout({ pageNum: 1 }));
  };

  const addLabel = (name: string) => {
    // if a sort variable is being added, add a panel label for the variable
    if (labels.indexOf(name) < 0) {
      const newLabels = Object.assign([], labels);
      newLabels.push(name);
      dispatch(setLabels(newLabels));
    }
  };
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
              {sort.map((d, i) => (
                <tr className={styles.sidebarSortTableRow} key={`${d.name}_tr`}>
                  <td className={styles.sidebarSortButton}>
                    <IconButton
                      color="primary"
                      key={`${d.name}_button`}
                      onClick={() => {
                        const sortObj = { ...sort2[i] };
                        sortObj.dir = sortObj.dir === 'asc' ? 'desc' : 'asc';
                        sort2[i] = sortObj;
                        handleChange(sort2);
                      }}
                    >
                      {d.dir === 'asc' ? (
                        <KeyboardArrowUpIcon fontSize="large" />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="large" />
                      )}
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
              ))}
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
                          addLabel(d);
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

export default SidebarSort;
