import React from 'react';
import Radium from 'radium';
import { SB_CONFIG } from '../constants.js';

const SideButton = ({ bstyle, isActive, icon, title, onClick }) => {
  const bottom = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTop: '1px solid',
    borderTopColor: bstyle.base.borderColor,
    borderBottom: '0px'
  };

  return (
    <div style={[bstyle.base, isActive && bstyle.active, title === SB_CONFIG && bottom]}
      type={"button"} onClick={onClick}
    >
      <i className={icon}></i>
    </div>
  );
};

SideButton.propTypes = {
  bstyle: React.PropTypes.object,
  isActive: React.PropTypes.bool,
  icon: React.PropTypes.string,
  title: React.PropTypes.string,
  onClick: React.PropTypes.func
};

export default Radium(SideButton);
