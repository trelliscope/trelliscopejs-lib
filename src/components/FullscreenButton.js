import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { emphasize } from 'material-ui/utils/colorManipulator';
import { addClass, removeClass } from '../classManipulation';
import { setFullscreen, windowResize } from '../actions';
import uiConsts from '../styles/uiConsts';

const FullscreenButton = ({ sheet: { classes }, fullscreen, appId, appDims,
  toggleFullscreen }) => {
  const cls = fullscreen ? 'icon-minimize' : 'icon-maximize';
  return (
    <button
      className={classes.button}
      onClick={() => toggleFullscreen(!fullscreen, appId, appDims)}
    >
      <i className={`${cls} ${classes.icon}`} />
    </button>
  );
};

FullscreenButton.propTypes = {
  sheet: React.PropTypes.object,
  fullscreen: React.PropTypes.bool,
  appId: React.PropTypes.string,
  appDims: React.PropTypes.object,
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
  { fullscreen: state.fullscreen, appId: state.appId, appDims: state.appDims }
);

const mapDispatchToProps = dispatch => ({
  toggleFullscreen: (fullscreen, appId, appDims) => {
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
    }
    dispatch(setFullscreen(fullscreen));
    dispatch(windowResize(newDims));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(FullscreenButton));
