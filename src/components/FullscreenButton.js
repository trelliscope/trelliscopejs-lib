import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { emphasize } from 'material-ui/utils/colorManipulator';
import { addClass, removeClass } from '../classManipulation';
import { setFullscreen, windowResize } from '../actions';
import uiConsts from '../styles/uiConsts';

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
  render() {
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
  appId: React.PropTypes.string,
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

const mapStateToProps = state => (
  { fullscreen: state.fullscreen, appId: state.appId }
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
