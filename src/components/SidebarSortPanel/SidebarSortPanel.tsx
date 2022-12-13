import React from 'react';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './SidebarSortPanel.module.scss';

interface SidebarSortPanelProps {
  handleSortChange: (sortSpec: ISortState[] | number) => void;
  sort: ISortState[];
  sort2: ISortState[];
  activeHeight: number;
  cogDesc: { [key: string]: string };
}

const SidebarSortPanel: React.FC<SidebarSortPanelProps> = ({ handleSortChange, sort, sort2, activeHeight, cogDesc }) => {
  const customStyles = {
    tableWrap: {
      maxHeight: activeHeight,
    },
  };
  return (
    <div className={styles.sidebarSortPanel}>
      <div className={styles.sidebarSortPanelTableWrap} style={customStyles.tableWrap}>
        <table className={styles.sidebarSortPanelTable}>
          <tbody>
            {sort.map((d, i) => (
              <tr className={styles.sidebarSortPanelTableRow} key={`${d.varname}_tr`}>
                <td className={styles.sidebarSortPanelButton}>
                  <IconButton
                    color="primary"
                    key={`${d.varname}_button`}
                    onClick={() => {
                      const sortObj = { ...sort2[i] };
                      sortObj.dir = sortObj.dir === 'asc' ? 'desc' : 'asc';
                      const newSort = [...sort2];
                      newSort[i] = sortObj;
                      handleSortChange(newSort);
                    }}
                  >
                    {d.dir === 'asc' ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                  </IconButton>
                </td>
                <td className={styles.sidebarSortPanelLabels}>
                  {d.varname}
                  <br />
                  <span style={{ color: '#888', fontStyle: 'italic' }}>{cogDesc[d.varname]}</span>
                </td>
                <td className={styles.sidebarSortPanelButtonClose}>
                  <IconButton onClick={() => handleSortChange(i)}>
                    <FontAwesomeIcon icon={faXmark} size="xs" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SidebarSortPanel;
