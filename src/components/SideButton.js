import React from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import { SB_CONFIG } from '../constants';
import uiConsts from '../assets/styles/uiConsts';

const SideButton = ({ sheet: { classes }, isActive, icon, title, label, onClick }) => (
  <button
    className={classNames({
      [classes.base]: true,
      [classes.active]: isActive,
      [classes.bottom]: title === SB_CONFIG
    })}
    type={'button'}
    onTouchTap={onClick}
  >
    <div className={classes.icon}>
      <i className={icon} />
    </div>
    <div className={classes.label}>{label}</div>
  </button>
);

SideButton.propTypes = {
  sheet: React.PropTypes.object,
  isActive: React.PropTypes.bool,
  icon: React.PropTypes.string,
  title: React.PropTypes.string,
  label: React.PropTypes.string,
  onClick: React.PropTypes.func
};

// ------ static styles ------

const staticStyles = {
  base: {
    position: 'relative',
    width: uiConsts.sideButtons.width,
    height: uiConsts.sideButtons.width,
    lineHeight: `${uiConsts.sideButtons.width}px`,
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: uiConsts.sideButtons.fontSize,
    color: uiConsts.sideButtons.button.color,
    borderBottom: `1px solid ${uiConsts.sideButtons.button.borderColor}`,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    userSelect: 'none',
    background: uiConsts.sideButtons.background,
    transition: 'color 0.2s, background 0.2s',
    '&:hover': {
      transition: 'color 0.2s, background 0.2s',
      background: uiConsts.sideButtons.button.hover.background,
      cursor: 'pointer'
    }
  },
  active: {
    transition: 'color 0.2s, background 0.2s',
    background: 'white',
    color: uiConsts.sideButtons.button.active.color,
    '&:hover': {
      transition: 'color 0.2s, background 0.2s',
      background: uiConsts.sideButtons.button.active.background
    }
  },
  icon: {
    lineHeight: `${uiConsts.sideButtons.fontSize}px`,
    height: uiConsts.sideButtons.fontSize,
    width: uiConsts.sideButtons.width,
    position: 'absolute',
    top: 8,
    left: 0
  },
  label: {
    fontSize: uiConsts.sideButtons.labelFontSize,
    lineHeight: `${uiConsts.sideButtons.labelFontSize}px`,
    width: uiConsts.sideButtons.width,
    // opacity: 0.6,
    position: 'absolute',
    bottom: 4,
    left: 0
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTop: '1px solid',
    borderBottom: '0px'
  }
};

export default injectSheet(staticStyles)(SideButton);
