import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import { createSelector } from 'reselect';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui-next/List';
import Checkbox from 'material-ui-next/Checkbox';
import { setLabels } from '../actions';
import { contentHeightSelector } from '../selectors/ui';
import { labelsSelector, displayInfoSelector } from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

const SidebarLabels = ({
  classes, height, labels, cogInfo, handleChange
}) => {
  let content = <div />;
  const ciKeys = Object.keys(cogInfo);
  if (ciKeys.length > 0) {
    const tableData = ciKeys.map(d => ({
      name: cogInfo[d].name,
      desc: cogInfo[d].desc
    }));

    content = (
      <div style={{ height, overflowY: 'auto' }}>
        <List style={{ padding: 0 }}>
          {tableData.map((value, i) => (
            <ListItem
              key={value.name}
              dense
              button
              onClick={() => handleChange(value.name, labels)}
            >
              <Checkbox
                checked={labels.indexOf(value.name) !== -1}
                style={{ width: 20, height: 20 }}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={value.name}
                secondary={value.desc}
                style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
  return (content);
};

SidebarLabels.propTypes = {
  height: PropTypes.number.isRequired,
  // sheet: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  cogInfo: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  rowDesc: {
    color: '#888',
    fontStyle: 'italic'
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector, labelsSelector, displayInfoSelector,
  (ch, labels, di) => ({
    width: uiConsts.sidebar.width,
    height: ch - uiConsts.sidebar.header.height,
    labels,
    cogInfo: di.info.cogInfo
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

const mapDispatchToProps = dispatch => ({
  handleChange: (value, labels) => {
    const idx = labels.indexOf(value);
    if (idx === -1) {
      labels.push(value);
    } else {
      labels.splice(idx, 1);
    }
    dispatch(setLabels(labels));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(SidebarLabels));
