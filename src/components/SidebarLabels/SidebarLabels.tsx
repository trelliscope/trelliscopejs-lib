import React from 'react';
import { connect } from 'react-redux';
import type { Action, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { setLabels } from '../../slices/labelsSlice';
import { contentHeightSelector } from '../../selectors/ui';
import { labelsSelector, curDisplayInfoSelector } from '../../selectors';
import { RootState } from '../../store';
import { DisplayInfoState } from '../../slices/displayInfoSlice';
import getCustomProperties from '../../getCustomProperties';
import styles from './SidebarLabels.module.scss';

interface SidebarLabelsProps {
  height: number;
  labels: string[];
  cogInfo: { [key: string]: CogInfo };
  curDisplayInfo: DisplayInfoState;
  handleChange: (arg1: string, arg2: string[]) => void;
}

const SidebarLabels: React.FC<SidebarLabelsProps> = ({ height, labels, cogInfo, curDisplayInfo, handleChange }) => {
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

const [sidebarWidth, sidebarHeaderHeight] = getCustomProperties(['--sidebar-width', '--sidebar-header-height']) as number[];

// ------ redux container ------

const stateSelector = createSelector(contentHeightSelector, labelsSelector, curDisplayInfoSelector, (ch, labels, cdi) => ({
  width: sidebarWidth,
  height: ch - sidebarHeaderHeight,
  labels,
  cogInfo: cdi.info.cogInfo,
  curDisplayInfo: cdi,
}));

const mapStateToProps = (state: RootState) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleChange: (value: string, labels: string[]) => {
    const idx = labels.indexOf(value);
    let newLabels = labels;
    if (idx === -1) {
      newLabels = [...labels, value];
    } else {
      newLabels = [...labels.slice(0, idx), ...labels.slice(idx + 1)];
    }
    dispatch(setLabels(newLabels));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarLabels);
