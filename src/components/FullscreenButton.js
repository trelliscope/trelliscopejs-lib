import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import { emphasize } from 'material-ui/utils/colorManipulator';
import { addClass, removeClass } from '../classManipulation';
import { dialogOpenSelector, fullscreenSelector,
  appIdSelector, singlePageAppSelector } from '../selectors';
import { sidebarActiveSelector } from '../selectors/ui';
import { setFullscreen, windowResize } from '../actions';
import uiConsts from '../assets/styles/uiConsts';

class FullscreenButton extends React.Component {
  constructor(props) {
    super(props);
    const el = document.getElementById(props.appId);
    // store all these things so we can restore them
    this.appDims = {
      width: el.clientWidth,
      height: el.clientHeight
    };
    this.yOffset = window.pageYOffset;
  }
  componentDidMount() {
    if (!this.props.singlePageApp && this.props.fullscreen &&
      this.props.sidebar === '' && !this.props.dialog) {
      Mousetrap.bindGlobal(['esc'], () => this.props.toggleFullscreen(false,
        this.props.appId, this.appDims, this.yOffset));
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.singlePageApp) {
      if (nextProps.fullscreen && nextProps.sidebar === '' && !nextProps.dialog) {
        Mousetrap.bindGlobal(['esc'], () => nextProps.toggleFullscreen(false,
          nextProps.appId, this.appDims, this.yOffset));
      }
      if (nextProps.dialog) {
        Mousetrap.unbind(['esc']);
      }
    }
  }
  componentWillUnmount() {
    if (!this.props.singlePageApp && this.props.fullscreen &&
      this.props.sidebar === '' && !this.props.dialog) {
      Mousetrap.unbind(['esc']);
    }
  }
  render() {
    if (this.props.singlePageApp) {
      return null;
    }

    const { classes } = this.props.sheet;
    const cls = this.props.fullscreen ? 'icon-minimize' : 'icon-maximize';

    return (
      <button
        className={classes.button}
        onClick={() => {
          if (!this.props.fullscreen) { // toggling to fullscreen
            this.yOffset = window.pageYOffset;
          }
          this.props.toggleFullscreen(
            !this.props.fullscreen,
            this.props.appId,
            this.appDims,
            this.yOffset);
        }}
      >
        <i className={`${cls} ${classes.icon}`} />
      </button>
    );
  }
}

FullscreenButton.propTypes = {
  sheet: React.PropTypes.object,
  fullscreen: React.PropTypes.bool,
  dialog: React.PropTypes.bool,
  sidebar: React.PropTypes.string,
  appId: React.PropTypes.string,
  singlePageApp: React.PropTypes.bool,
  toggleFullscreen: React.PropTypes.func
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
  (sidebar, dialog, fullscreen, appId, singlePageApp) => ({
    sidebar,
    dialog,
    fullscreen,
    appId,
    singlePageApp
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

const mapDispatchToProps = dispatch => ({
  toggleFullscreen: (fullscreen, appId, appDims, yOffset) => {
    const el = document.getElementById(appId);
    const newDims = {};
    if (fullscreen) {
      addClass(document.body, 'trscope-body');
      addClass(document.getElementsByTagName('html')[0], 'trscope-html');
      addClass(el, 'trscope-fullscreen');
      newDims.width = window.innerWidth;
      newDims.height = window.innerHeight;
    } else {
      removeClass(document.body, 'trscope-body');
      removeClass(document.getElementsByTagName('html')[0], 'trscope-html');
      removeClass(el, 'trscope-fullscreen');
      newDims.width = appDims.width;
      newDims.height = appDims.height;
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
