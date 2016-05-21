import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { setLabels } from '../actions';
import { uiConstsSelector, contentHeightSelector } from '../selectors';

import { Table, TableRow,
  TableRowColumn, TableBody } from 'material-ui/Table';

const SidebarLabels = ({ style, labels, cogInfo, handleChange }) => {
  let content = <div></div>;
  if (cogInfo.length > 0) {
    const tableData = cogInfo.map((d) => ({
      name: d.name,
      desc: d.desc,
      selected: labels.indexOf(d.name) > -1
    }));

    content = (
      <Table
        height={`${style.height}px`}
        fixedHeader
        multiSelectable
        onRowSelection={(rows) => {
          const newLabels = [];
          for (let ii = 0; ii < rows.length; ii++) {
            newLabels.push(cogInfo[rows[ii]].name);
          }
          handleChange(newLabels);
        }}
      >
        <TableBody
          displayRowCheckbox
          deselectOnClickaway={false}
          style={{ cursor: 'pointer' }}
        >
          {tableData.map((row) => (
            <TableRow key={row.name} selected={row.selected}>
              <TableRowColumn>{row.name}<br />
                <span style={{ color: '#888', fontStyle: 'italic' }}>
                  {row.desc}
                </span>
              </TableRowColumn>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }
  return (content);
};

SidebarLabels.propTypes = {
  style: React.PropTypes.object,
  labels: React.PropTypes.array,
  cogInfo: React.PropTypes.array,
  handleChange: React.PropTypes.func
};

// ------ redux container ------

const labelsSelector = state => state.labels;
const dispSelector = state => state._displayInfo;

const stateSelector = createSelector(
  contentHeightSelector, uiConstsSelector, labelsSelector, dispSelector,
  (ch, ui, labels, di) => ({
    style: {
      width: ui.sidebar.width,
      height: ch - ui.sidebar.header.height,
      background: di.isFetching ? 'red' : 'white'
    },
    labels,
    cogInfo: di.info.cogInfo
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (labels) => {
    dispatch(setLabels(labels));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(SidebarLabels));
