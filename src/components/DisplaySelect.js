import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { createSelector } from 'reselect';
import Mousetrap from 'Mousetrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { emphasize } from 'material-ui/utils/colorManipulator';
import DisplayList from './DisplayList';
import { setSelectedDisplay, fetchDisplay } from '../actions';
import { uiConstsSelector } from '../selectors';

class DisplaySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, displayList: [], open: false };
  }
  componentDidMount() {
    fetch('vdb/displays/displayList.json')
      .then(response => response.json())
      .then(json => {
        this.setState({ displayList: json, loaded: true });
      });
    Mousetrap.bind(['o'], this.handleKey);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['o']);
  }
  handleOpen = () => {
    if (this.state.loaded) {
      // this.props.handleClick(
      //   this.state.displayList[0].name, this.state.displayList[0].group);
      this.setState({ open: true });
    }
  }
  handleKey = () => {
    this.setState({ open: true });
  }
  handleClose = () => {
    this.setState({ open: false });
  }
  handleSelect = (name, group) => {
    this.props.handleClick(name, group);
    this.setState({ open: false });
  }
  render() {
    const actions = [
      <FlatButton
        label="Close"
        secondary
        onTouchTap={this.handleClose}
      />
    ];
    let styleOverride = {
      background: '#ddd',
      borderColor: '#ddd',
      ':hover': {
        background: '#ccc',
        borderColor: '#ccc'
      }
    };
    if (this.state.loaded) {
      styleOverride = { };
    }
    return (
      <div
        onClick={this.handleOpen}
        style={[this.props.style, styleOverride]}
      >
        <i className="fa fa-folder-open"></i>
        <Dialog
          title="Select a Display"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <DisplayList
            displayInfo={this.state.displayList}
            handleClick={this.handleSelect}
          />
        </Dialog>
      </div>
    );
  }
}

DisplaySelect.propTypes = {
  style: React.PropTypes.object,
  handleClick: React.PropTypes.func
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector,
  (ui) => ({
    style: {
      // position: 'absolute',
      boxSizing: 'border-box',
      // top: 0,
      // right: 0,
      display: 'inline-block',
      height: ui.header.height,
      width: ui.header.height,
      fontSize: 16,
      lineHeight: `${ui.header.height}px`,
      background: ui.header.button.active.background,
      color: 'white',
      // color: ui.header.button.color,
      textAlign: 'center',
      borderRight: '1px solid',
      borderColor: ui.header.button.active.background,
      // borderColor: ui.header.borderColor,
      ':hover': {
        background: emphasize(ui.header.button.active.background, 0.4),
        color: 'white',
        cursor: 'pointer',
        borderColor: emphasize(ui.header.button.active.background, 0.4)
      }
    }
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleClick: (name, group) => {
    dispatch(setSelectedDisplay(name, group));
    dispatch(fetchDisplay(name, group));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(DisplaySelect));
