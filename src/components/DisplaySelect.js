import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import DisplayList from './DisplayList';
import {
  setSelectedDisplay, fetchDisplay, setActiveSidebar,
  setLabels, setLayout, setSort, setFilter, setFilterView,
  setDispSelectDialogOpen, resetRelDisps, setRelDispPositions
} from '../actions';
import { displayGroupsSelector } from '../selectors/display';
import {
  appIdSelector, configSelector, displayListSelector, fullscreenSelector,
  selectedDisplaySelector, singlePageAppSelector, dispSelectDialogSelector
} from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

class DisplaySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnScale: 1
    };
  }

  componentDidMount() {
    const {
      fullscreen, selectedDisplay
    } = this.props;
    const { btnScale } = this.state;

    if (fullscreen) {
      Mousetrap.bind('o', this.handleKey);
    }

    const attnInterval = setInterval(() => {
      const elem = this._atnnCircle;
      if (selectedDisplay.name !== '') {
        clearInterval(attnInterval);
      }
      if (elem) {
        elem.style.transform = `scale(${btnScale})`;
        this.setState({ btnScale: btnScale === 1 ? 0.85 : 1 });
      }
    }, 750);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    if (nextProps.fullscreen) {
      Mousetrap.bind('o', this.handleKey);
    } else {
      Mousetrap.unbind('o');
    }
  }

  componentWillUnmount() {
    const { fullscreen } = this.props;
    if (fullscreen) {
      Mousetrap.unbind('o');
    }
  }

  handleOpen = () => {
    const { displayList, setDialogOpen, setDispDialogOpen } = this.props;
    if (displayList && displayList.isLoaded) {
      setDialogOpen(true);
      setDispDialogOpen(true);
      Mousetrap.bind('esc', this.handleClose);
    }
  }

  handleKey = () => {
    const { setDialogOpen, setDispDialogOpen } = this.props;
    setDialogOpen(true);
    setDispDialogOpen(true);
    Mousetrap.bind('esc', this.handleClose);
  }

  handleClose = () => {
    const { setDialogOpen, setDispDialogOpen } = this.props;
    setDialogOpen(false);
    setDispDialogOpen(false);
    Mousetrap.unbind('esc');
  }

  handleSelect = (name, group, desc) => {
    const {
      handleClick, setDialogOpen, setDispDialogOpen, cfg, appId
    } = this.props;
    handleClick(name, group, desc, cfg, appId);
    setDialogOpen(false);
    setDispDialogOpen(false);
  }

  render() {
    const {
      classes, displayList, displayGroups, selectedDisplay, isOpen
    } = this.props;

    const isLoaded = displayList && displayList.isLoaded;
    let attnDiv = (
      <div className={classes.attnOuter}>
        <div className={classes.attnInner}>
          <div
            ref={(d) => { this._atnnCircle = d; }}
            className={classes.attnEmpty}
          />
        </div>
      </div>
    );
    if (selectedDisplay.name !== '' || isOpen) {
      attnDiv = '';
    }

    return (
      <div>
        <button
          type="button"
          onClick={this.handleOpen}
          className={classNames({ [classes.button]: true, [classes.buttonInactive]: !isLoaded })}
        >
          {attnDiv}
          <i className={`icon-folder-open ${classes.folderIcon}`} />
        </button>
        <Dialog
          open={isOpen}
          className="trelliscope-app"
          style={{ zIndex: 8000, fontWeight: 300 }}
          aria-labelledby="dialog-dispselect-title"
          onBackdropClick={this.handleClose}
          disableEscapeKeyDown
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="dialog-dispselect-title">Select a Display to Open</DialogTitle>
          <DialogContent>
            <DisplayList
              di={displayList.list}
              displayGroups={displayGroups}
              handleClick={this.handleSelect}
              selectable={false}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DisplaySelect.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
  setDispDialogOpen: PropTypes.func.isRequired,
  cfg: PropTypes.object.isRequired,
  // singlePageApp: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  appId: PropTypes.string.isRequired,
  selectedDisplay: PropTypes.object.isRequired,
  displayList: PropTypes.object.isRequired,
  displayGroups: PropTypes.object.isRequired
};

// ------ static styles ------

const staticStyles = {
  attnOuter: {
    position: 'absolute',
    overflow: 'hidden',
    height: uiConsts.header.height,
    width: uiConsts.header.height,
    top: 0,
    left: (uiConsts.sideButtons.width - uiConsts.header.height) / 2,
    pointerEvents: 'none'
  },
  attnInner: {
    position: 'absolute',
    height: uiConsts.header.height,
    width: uiConsts.header.height,
    top: 0,
    left: 0,
    transition: ['transform 450ms cubic-bezier(0.23, 1, 0.32, 1)',
      '0ms opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'].join(' '),
    opacity: 1,
    transform: 'scale(0.85)'
  },
  attnEmpty: {
    position: 'absolute',
    height: uiConsts.header.height,
    width: '100%',
    borderRadius: '50%',
    opacity: 0.16,
    transition: 'transform 750ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 0ms',
    top: 0,
    transform: 'scale(0.85)',
    backgroundColor: 'rgba(0, 0, 0, 0.870588)'
  },
  folderIcon: {
    paddingLeft: 3
  },
  button: {
    zIndex: 8000,
    position: 'absolute',
    boxSizing: 'border-box',
    top: -1, // cover up top app border
    left: -1,
    height: uiConsts.header.height,
    width: uiConsts.sideButtons.width,
    fontSize: 18,
    lineHeight: `${uiConsts.header.height + 2}px`,
    background: uiConsts.header.button.active.background,
    color: 'white',
    // color: uiConsts.header.button.color,
    textAlign: 'center',
    border: 'none',
    transition: 'all 500ms ease-in',
    '&:hover': {
      transition: 'background 250ms',
      background: emphasize(uiConsts.header.button.active.background, 0.2),
      color: 'white',
      cursor: 'pointer'
    }
  },
  buttonInactive: {
    background: '#ddd',
    borderColor: '#ddd',
    '&:hover': {
      background: '#ccc',
      borderColor: '#ccc'
    }
  }
};

// ------ redux container ------

const styleSelector = createSelector(
  selectedDisplaySelector, displayListSelector,
  displayGroupsSelector, configSelector, appIdSelector,
  singlePageAppSelector, fullscreenSelector, dispSelectDialogSelector,
  (selectedDisplay, displayList, displayGroups, cfg, appId, singlePageApp, fullscreen, isOpen) => ({
    appId,
    cfg,
    selectedDisplay,
    displayList,
    displayGroups,
    singlePageApp,
    fullscreen,
    isOpen
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleClick: (name, group, desc, cfg, appId) => {
    // need to clear out state for new display...
    // first close sidebars for safety
    // (there is an issue when the filter sidebar stays open when changing - revisit this)
    dispatch(setActiveSidebar(''));
    // dispatch(setPanelRenderers(null));
    dispatch(resetRelDisps());
    dispatch(setLabels([]));
    dispatch(setLayout({ nrow: 1, ncol: 1, arrange: 'row' }));
    dispatch(setLayout({ pageNum: 1 }));
    dispatch(setFilterView({ active: [], inactive: [] }));
    dispatch(setFilter({}));
    dispatch(setSort([]));
    dispatch(setRelDispPositions([]));

    dispatch(setSelectedDisplay(name, group, desc));
    dispatch(fetchDisplay(name, group, cfg, appId, ''));
  },
  setDispDialogOpen: (isOpen) => {
    dispatch(setDispSelectDialogOpen(isOpen));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(DisplaySelect));
