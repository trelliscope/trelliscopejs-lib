import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { addClass, removeClass } from '../classManipulation';
import {
  dialogOpenSelector, fullscreenSelector,
  appIdSelector, singlePageAppSelector
} from '../selectors';
import {
  sidebarActiveSelector, origWidthSelector, origHeightSelector
} from '../selectors/ui';
import { setFullscreen, windowResize } from '../actions';
import uiConsts from '../assets/styles/uiConsts';

class FullscreenButton extends React.Component {
  constructor(props) {
    super(props);
    // store all these things so we can restore them
    this.yOffset = window.pageYOffset;
  }

  componentDidMount() {
    const {
      singlePageApp, fullscreen, sidebar, dialog, appId, toggleFullscreen, ww, hh
    } = this.props;
    if (!singlePageApp && fullscreen && sidebar === '' && !dialog) {
      Mousetrap.bindGlobal('esc', () => toggleFullscreen(false,
        appId, { width: ww, height: hh }, this.yOffset));
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    const { singlePageApp, ww, hh } = this.props;
    if (!singlePageApp) {
      if (nextProps.fullscreen && nextProps.sidebar === '' && !nextProps.dialog) {
        Mousetrap.bindGlobal('esc', () => nextProps.toggleFullscreen(false,
          nextProps.appId, { width: ww, height: hh }, this.yOffset));
      }
      if (nextProps.dialog) {
        Mousetrap.unbind('esc');
      }
    }
  }

  componentWillUnmount() {
    const {
      singlePageApp, fullscreen, sidebar, dialog
    } = this.props;
    if (!singlePageApp && fullscreen && sidebar === '' && !dialog) {
      Mousetrap.unbind('esc');
    }
  }

  render() {
    const {
      singlePageApp, fullscreen, appId, ww, hh, toggleFullscreen
    } = this.props;

    if (singlePageApp) {
      return null;
    }

    const { classes } = this.props;
    const cls = fullscreen ? 'icon-minimize' : 'icon-maximize';

    return (
      <button
        type="button"
        className={classes.button}
        onClick={() => {
          if (!fullscreen) { // toggling to fullscreen
            this.yOffset = window.pageYOffset;
          }
          toggleFullscreen(
            !fullscreen,
            appId,
            { width: ww, height: hh },
            this.yOffset);
        }}
      >
        <i className={`${cls} ${classes.icon}`} />
      </button>
    );
  }
}

FullscreenButton.propTypes = {
  classes: PropTypes.object.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  dialog: PropTypes.bool.isRequired,
  sidebar: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  singlePageApp: PropTypes.bool.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
  ww: PropTypes.number.isRequired,
  hh: PropTypes.number.isRequired
};

// ------ static styles ------

const staticStyles = {
  button: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    textAlign: 'center',
    background: emphasize(uiConsts.footer.background, 0.2),
    width: uiConsts.footer.height,
    height: uiConsts.footer.height,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 100ms ease-in',
    '&:hover': {
      background: emphasize(uiConsts.footer.background, 0.3)
    }
  },
  icon: {
    color: emphasize(uiConsts.footer.background, 0.8),
    fontSize: `${uiConsts.footer.height - 16}px`
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  sidebarActiveSelector, dialogOpenSelector, fullscreenSelector,
  appIdSelector, singlePageAppSelector,
  origWidthSelector, origHeightSelector,
  (sidebar, dialog, fullscreen, appId, singlePageApp, ww, hh) => ({
    sidebar,
    dialog,
    fullscreen,
    appId,
    singlePageApp,
    ww,
    hh
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  toggleFullscreen: (fullscreen, appId, appDims, yOffset) => {
    const el = document.getElementById(appId);
    const newDims = {};
    if (fullscreen) {
      addClass(document.body, 'trelliscope-fullscreen-body');
      addClass(document.getElementsByTagName('html')[0], 'trelliscope-fullscreen-html');
      addClass(el, 'trelliscope-fullscreen-el');
      newDims.width = window.innerWidth;
      newDims.height = window.innerHeight;
      // move the div to the outside of the document to make sure it's on top
      const bodyEl = document.getElementById('trelliscope-fullscreen-div');
      bodyEl.style.display = 'block';
      bodyEl.appendChild(el);
    } else {
      removeClass(document.body, 'trelliscope-fullscreen-body');
      removeClass(document.getElementsByTagName('html')[0], 'trelliscope-fullscreen-html');
      removeClass(el, 'trelliscope-fullscreen-el');
      newDims.width = appDims.width;
      newDims.height = appDims.height;
      // move the div back to its parent element
      document.getElementById(`${el.id}-parent`).appendChild(el);
      document.getElementById('trelliscope-fullscreen-div').style.display = 'none';
      // restore to y offset we were at before going fullscreen
      window.scrollTo(window.pageXOffset, yOffset);
    }
    dispatch(setFullscreen(fullscreen));
    dispatch(windowResize(newDims));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(FullscreenButton));
