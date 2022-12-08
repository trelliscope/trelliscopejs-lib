import React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { DisplayInfoState } from '../../slices/displayInfoSlice';
import SidebarLabelPill from '../SidebarLabelPill';
import styles from './SidebarLabels.module.scss';

interface SidebarLabelsProps {
  sidebarHeaderHeight: number;
  ch: number;
  labels: string[];
  curDisplayInfo: DisplayInfoState;
  cogInfo: {
    [key: string]: CogInfo;
  };
  handleLabelChange: (value: string) => void;
}

const SidebarLabels: React.FC<SidebarLabelsProps> = ({
  sidebarHeaderHeight,
  ch,
  labels,
  curDisplayInfo,
  cogInfo,
  handleLabelChange,
}) => {
  const height = ch - sidebarHeaderHeight;
  const { cogGroups } = curDisplayInfo.info;
  const ciKeys = Object.keys(cogInfo);

  return (
    <>
      {ciKeys.length > 0 && (
        <div className={styles.sidebarLabels} style={{ height }}>
          <List className={styles.sidebarLabelsList}>
            {Object.keys(cogGroups).map((grp) => {
              const curItems = cogGroups[grp];
              if (curItems.length === 0) {
                return null;
              }
              return (
                <React.Fragment key={grp}>
                  {!['condVar', 'common', 'panelKey'].includes(grp) && (
                    <ListSubheader className={styles.sidebarLabelsCogGroupHeader}>
                      <span className={styles.sidebarLabelsCogGroupText}>{`${grp} (${curItems.length})`}</span>
                    </ListSubheader>
                  )}
                  {[...cogGroups[grp]].sort().map((d: string) => (
                    <SidebarLabelPill
                      labels={labels}
                      cogInfo={cogInfo}
                      d={d}
                      handleLabelChange={handleLabelChange}
                      key={`${d}_${grp}`}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </List>
        </div>
      )}
    </>
  );
};

export default SidebarLabels;
