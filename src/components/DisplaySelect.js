import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { emphasize } from 'material-ui/utils/colorManipulator';
import DisplayList from './DisplayList';
import { setSelectedDisplay, fetchDisplayList, fetchDisplay } from '../actions';
import { uiConstsSelector } from '../selectors';

class DisplaySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      btnScale: 1
    };
  }
  componentDidMount() {
    this.props.loadDisplayList();

    Mousetrap.bind(['o'], this.handleKey);

    const attnInterval = setInterval(() => {
      const elem = ReactDOM.findDOMNode(this.refs.attnCircle);
      if (this.props.selectedDisplay.name !== '') {
        clearInterval(attnInterval);
      }
      if (elem) {
        elem.style.transform = `scale(${this.state.btnScale})`;
        this.setState({ btnScale: this.state.btnScale === 1 ? 0.85 : 1 });
      }
    }, 750);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['o']);
  }
  handleOpen = () => {
    if (this.props.displayList && this.props.displayList.isLoaded) {
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
    if (this.props.displayList && this.props.displayList.isLoaded) {
      styleOverride = { };
    }
    let attnDiv = (
      <div style={this.props.style.attn.outer}>
        <div style={this.props.style.attn.inner}>
          <div ref="attnCircle" style={this.props.style.attn.empty}>
          </div>
        </div>
      </div>
    );
    if (this.props.selectedDisplay.name !== '' || this.state.open) {
      attnDiv = '';
    }

    return (
      <div
        onClick={this.handleOpen}
        style={[this.props.style.button, styleOverride]}
      >
        {attnDiv}
        <i className="icon-folder-open" style={{ paddingLeft: 3 }}></i>
        <Dialog
          title="Select a Display to Open"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <DisplayList
            displayInfo={this.props.displayList.list}
            handleClick={this.handleSelect}
          />
        </Dialog>
      </div>
    );
  }
}

DisplaySelect.propTypes = {
  style: React.PropTypes.object,
  handleClick: React.PropTypes.func,
  loadDisplayList: React.PropTypes.func,
  selectedDisplay: React.PropTypes.object,
  displayList: React.PropTypes.object
};

// ------ redux container ------

const displayListSelector = state => state._displayList;
const selectedDisplaySelector = state => state.selectedDisplay;

const styleSelector = createSelector(
  uiConstsSelector, selectedDisplaySelector, displayListSelector,
  (ui, selectedDisplay, displayList) => ({
    style: {
      attn: {
        outer: {
          position: 'absolute',
          overflow: 'hidden',
          height: 45,
          width: 45,
          top: 0,
          left: 0,
          pointerEvents: 'none'
        },
        inner: {
          position: 'absolute',
          height: 45,
          width: 45,
          top: 0,
          left: 0,
          transition: ['transform 450ms cubic-bezier(0.23, 1, 0.32, 1)',
            '0ms opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'].join(' '),
          opacity: 1,
          transform: 'scale(0.85)'
        },
        empty: {
          position: 'absolute',
          height: 45, width: '100%',
          borderRadius: '50%',
          opacity: 0.16,
          transition: 'transform 750ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 0ms',
          top: 0,
          transform: 'scale(0.85)',
          backgroundColor: 'rgba(0, 0, 0, 0.870588)'
        }
      },
      button: {
        zIndex: 500,
        position: 'fixed',
        boxSizing: 'border-box',
        top: 0,
        left: 0,
        height: ui.header.height,
        width: ui.header.height,
        fontSize: 16,
        lineHeight: `${ui.header.height + 2}px`,
        background: ui.header.button.active.background,
        color: 'white',
        // color: ui.header.button.color,
        textAlign: 'center',
        borderRight: '1px solid',
        borderColor: ui.header.button.active.background,
        // borderColor: ui.header.borderColor,
        transition: 'background 250ms',
        ':hover': {
          transition: 'background 250ms',
          background: emphasize(ui.header.button.active.background, 0.4),
          color: 'white',
          cursor: 'pointer',
          borderColor: emphasize(ui.header.button.active.background, 0.4)
        }
      }
    },
    selectedDisplay,
    displayList
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleClick: (name, group) => {
    dispatch(setSelectedDisplay(name, group));
    dispatch(fetchDisplay(name, group));
  },
  loadDisplayList: () => {
    dispatch(fetchDisplayList());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(DisplaySelect));
