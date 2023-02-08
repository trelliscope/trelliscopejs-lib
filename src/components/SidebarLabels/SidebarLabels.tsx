import React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLabelPill from '../SidebarLabelPill';
import { useDisplayMetasWithInputs, useMetaGroupsWithInputsSorted } from '../../slices/displayInfoAPI';
import { labelsSelector } from '../../selectors';
import styles from './SidebarLabels.module.scss';
import { setLabels } from '../../slices/labelsSlice';

const SidebarLabels: React.FC = () => {
  const dispatch = useDispatch();
  const labels = useSelector(labelsSelector);
  const labelObj = useMetaGroupsWithInputsSorted() as { [key: string]: string[] };
  const metasWithInputs = useDisplayMetasWithInputs();
  const labelDescriptionMap = new Map();
  metasWithInputs.forEach((meta) => {
    labelDescriptionMap.set(meta.varname, meta.label);
  });

  const handleLabelChange = (value: string) => {
    const idx = labels.indexOf(value);
    let newLabels = labels;
    if (idx === -1) {
      newLabels = [...labels, value];
    } else {
      newLabels = [...labels.slice(0, idx), ...labels.slice(idx + 1)];
    }
    dispatch(setLabels(newLabels));
  };

  return (
    <>
      {labelDescriptionMap.size > 0 && (
        <div className={styles.sidebarLabels}>
          <List className={styles.sidebarLabelsList}>
            {Object.keys(labelObj).map((grp) => {
              const curItems = labelObj[grp];
              if (curItems?.length === 0 || !curItems) {
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
