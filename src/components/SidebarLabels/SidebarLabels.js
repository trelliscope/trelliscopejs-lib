import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { setLabels } from '../../actions';
import { contentHeightSelector } from '../../selectors/ui';
import { labelsSelector, curDisplayInfoSelector } from '../../selectors';
import uiConsts from '../../assets/styles/uiConsts';
import styles from './SidebarLabels.module.scss';

const SidebarLabels = ({ height, labels, cogInfo, curDisplayInfo, handleChange }) => {
  let content = <div />;
  const { cogGroups } = curDisplayInfo.info;
  const ciKeys = Object.keys(cogInfo);
  if (ciKeys.length > 0) {
    content = (
      <div style={{ height, overflowY: 'auto', overflowX: 'hidden' }}>
        <List style={{ padding: 0 }}>
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
                {cogGroups[grp].sort().map((d) => (
                  <ListItem key={cogInfo[d].name} dense button onClick={() => handleChange(cogInfo[d].name, labels)}>
                    <Checkbox
                      checked={labels.indexOf(cogInfo[d].name) !== -1}
                      style={{ width: 20, height: 20 }}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText
                      primary={cogInfo[d].name}
                      secondary={cogInfo[d].desc}
                      style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
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

// ------ redux container ------

const stateSelector = createSelector(contentHeightSelector, labelsSelector, curDisplayInfoSelector, (ch, labels, cdi) => ({
  width: uiConsts.sidebar.width,
  height: ch - uiConsts.sidebar.header.height,
  labels,
  cogInfo: cdi.info.cogInfo,
  curDisplayInfo: cdi,
}));

const mapStateToProps = (state) => stateSelector(state);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (value, labels) => {
    const idx = labels.indexOf(value);
    if (idx === -1) {
      labels.push(value);
    } else {
      labels.splice(idx, 1);
    }
    dispatch(setLabels(labels));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarLabels);
