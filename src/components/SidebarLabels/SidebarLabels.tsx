import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { setLabels } from '../../slices/labelsSlice';
import { contentHeightSelector } from '../../selectors/ui';
import { labelsSelector, curDisplayInfoSelector } from '../../selectors';
import getCustomProperties from '../../getCustomProperties';
import styles from './SidebarLabels.module.scss';

const SidebarLabels: React.FC = () => {
  const dispatch = useDispatch();
  const [sidebarHeaderHeight] = getCustomProperties(['--sidebar-header-height']) as number[];
  const ch = useSelector(contentHeightSelector);
  const height = ch - sidebarHeaderHeight;
  const labels = useSelector(labelsSelector);
  const curDisplayInfo = useSelector(curDisplayInfoSelector);
  const { cogInfo } = curDisplayInfo.info;

  const handleChange = (value: string) => {
    const idx = labels.indexOf(value);
    let newLabels = labels;
    if (idx === -1) {
      newLabels = [...labels, value];
    } else {
      newLabels = [...labels.slice(0, idx), ...labels.slice(idx + 1)];
    }
    dispatch(setLabels(newLabels));
  };

  let content = <div />;
  const { cogGroups } = curDisplayInfo.info;
  const ciKeys = Object.keys(cogInfo);
  if (ciKeys.length > 0) {
    content = (
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
                  <ListItem key={cogInfo[d].name} dense button onClick={() => handleChange(cogInfo[d].name, labels)}>
                    <Checkbox
                      checked={labels.indexOf(cogInfo[d].name) !== -1}
                      className={styles.sidebarLabelsListCheckbox}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText
                      primary={cogInfo[d].name}
                      secondary={cogInfo[d].desc}
                      className={styles.sidebarLabelsListItem}
                    />
                  </ListItem>
                ))}
              </React.Fragment>
            );
          })}
        </List>
      </div>
    );
  }
  return content;
};

export default SidebarLabels;
