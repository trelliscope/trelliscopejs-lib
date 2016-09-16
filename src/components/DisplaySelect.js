import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { emphasize } from 'material-ui/utils/colorManipulator';
import DisplayList from './DisplayList';
import { setSelectedDisplay, fetchDisplay, setPanelRenderer,
  setLabels, setLayout, setSort, setFilter, setFilterView } from '../actions';
import { uiConstsSelector } from '../selectors/ui';
import { displayGroupsSelector } from '../selectors/display';
import { configSelector, displayListSelector,
  selectedDisplaySelector } from '../selectors';

class DisplaySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.selectedDisplay.name === '',
      btnScale: 1
    };
  }
  componentWillMount() {
    if (this.props.selectedDisplay.name === '') {
      this.props.setDialogOpen(true);
    }
  }
  componentDidMount() {
    Mousetrap.bind(['o'], this.handleKey);

    const attnInterval = setInterval(() => {
      const elem = this._atnnCircle;
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
      this.props.setDialogOpen(true);
      this.setState({ open: true });
    }
  }
  handleKey = () => {
    this.props.setDialogOpen(true);
    this.setState({ open: true });
  }
  handleClose = () => {
    this.props.setDialogOpen(false);
    this.setState({ open: false });
  }
  handleSelect = (name, group, desc) => {
    this.props.handleClick(name, group, desc, this.props.cfg);
    this.props.setDialogOpen(false);
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
          <div
            ref={d => { this._atnnCircle = d; }}
            style={this.props.style.attn.empty}
          />
        </div>
      </div>
    );
    if (this.props.selectedDisplay.name !== '' || this.state.open) {
      attnDiv = '';
    }

    return (
      <button
        onClick={this.handleOpen}
        style={[this.props.style.button, styleOverride]}
      >
        {attnDiv}
        <i className="icon-folder-open" style={{ paddingLeft: 3 }} />
        <Dialog
          title="Select a Display to Open"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <DisplayList
            di={this.props.displayList.list}
            displayGroups={this.props.displayGroups}
            handleClick={this.handleSelect}
            cfg={this.props.cfg}
          />
        </Dialog>
      </button>
    );
  }
}

DisplaySelect.propTypes = {
  style: React.PropTypes.object,
  handleClick: React.PropTypes.func,
  setDialogOpen: React.PropTypes.func,
  cfg: React.PropTypes.object,
  selectedDisplay: React.PropTypes.object,
  displayList: React.PropTypes.object,
  displayGroups: React.PropTypes.object
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector, selectedDisplaySelector, displayListSelector,
  displayGroupsSelector, configSelector,
  (ui, selectedDisplay, displayList, displayGroups, cfg) => ({
    style: {
      attn: {
        outer: {
          position: 'absolute',
          overflow: 'hidden',
          height: ui.header.height,
          width: ui.header.height,
          top: 0,
          left: (ui.sideButtons.width - ui.header.height) / 2,
          pointerEvents: 'none'
        },
        inner: {
          position: 'absolute',
          height: ui.header.height,
          width: ui.header.height,
          top: 0,
          left: 0,
          transition: ['transform 450ms cubic-bezier(0.23, 1, 0.32, 1)',
            '0ms opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'].join(' '),
          opacity: 1,
          transform: 'scale(0.85)'
        },
        empty: {
          position: 'absolute',
          height: ui.header.height,
          width: '100%',
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
        width: ui.sideButtons.width,
        fontSize: 18,
        lineHeight: `${ui.header.height + 2}px`,
        background: ui.header.button.active.background,
        color: 'white',
        // color: ui.header.button.color,
        textAlign: 'center',
        border: 'none',
        transition: 'all 500ms ease-in',
        ':hover': {
          transition: 'background 250ms',
          background: emphasize(ui.header.button.active.background, 0.2),
          color: 'white',
          cursor: 'pointer'
        }
      }
    },
    cfg,
    selectedDisplay,
    displayList,
    displayGroups
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleClick: (name, group, desc, cfg) => {
    // need to clear out state for new display...
    dispatch(setPanelRenderer(null));
    dispatch(setLabels([]));
    dispatch(setLayout({ nrow: 1, ncol: 1, arrange: 'row', pageNum: 1 }));
    dispatch(setFilter({}));
    dispatch(setFilterView({}));
    dispatch(setSort([]));

    dispatch(setSelectedDisplay(name, group, desc));
    dispatch(fetchDisplay(name, group, cfg));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(DisplaySelect));
