import React from 'react';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import styles from './SidebarSortPanel.module.scss';

interface SidebarSortPanelProps {
  handleSortChange: (sortSpec: Sort[] | number) => void;
  sort: Sort[];
  sort2: Sort[];
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
              <tr className={styles.sidebarSortPanelTableRow} key={`${d.name}_tr`}>
                <td className={styles.sidebarSortPanelButton}>
                  <IconButton
                    color="primary"
                    key={`${d.name}_button`}
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
                  {d.name}
                  <br />
                  <span style={{ color: '#888', fontStyle: 'italic' }}>{cogDesc[d.name]}</span>
                </td>
                <td className={styles.sidebarSortPanelButtonClose}>
                  <IconButton onClick={() => handleSortChange(i)}>
                    <Icon className="icon-times" style={{ fontSize: 16, color: '#aaa' }} />
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
