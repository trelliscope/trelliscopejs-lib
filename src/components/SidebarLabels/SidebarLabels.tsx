import React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import SidebarLabelPill from '../SidebarLabelPill';
import styles from './SidebarLabels.module.scss';
import { useDisplayMetasWithInputs, useMetaGroupsWithInputsSorted } from '../../slices/displayInfoAPI';

interface SidebarLabelsProps {
  sidebarHeaderHeight: number;
  ch: number;
  labels: string[];
  handleLabelChange: (value: string) => void;
}

const SidebarLabels: React.FC<SidebarLabelsProps> = ({ sidebarHeaderHeight, ch, labels, handleLabelChange }) => {
  const labelObj = useMetaGroupsWithInputsSorted() as { [key: string]: string[] };
  const metasWithInputs = useDisplayMetasWithInputs();
  const height = ch - sidebarHeaderHeight;
  const labelDescriptionMap = new Map();
  metasWithInputs.forEach((meta) => {
    labelDescriptionMap.set(meta.varname, meta.label);
  });

  return (
    <>
      {labelDescriptionMap.size > 0 && (
        <div className={styles.sidebarLabels} style={{ height }}>
          <List className={styles.sidebarLabelsList}>
            {Object.keys(labelObj).map((grp) => {
              const curItems = labelObj[grp];
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
                  {[...labelObj[grp]].sort().map((label: string) => (
                    <SidebarLabelPill
                      labels={labels}
                      labelDescriptionMap={labelDescriptionMap}
                      label={label}
                      handleLabelChange={handleLabelChange}
                      key={`${label}_${grp}`}
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
