import React from 'react';
import Radium from 'radium';
import { SB_CONFIG } from '../constants';

const SideButton = ({ bstyle, isActive, icon, title, label, onClick }) => {
  const bottom = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTop: '1px solid',
    borderTopColor: bstyle.base.borderColor,
    borderBottom: '0px'
  };

  return (
    <button
      style={[bstyle.base, isActive && bstyle.active, title === SB_CONFIG && bottom]}
      type={"button"}
      onClick={onClick}
    >
      <div style={bstyle.icon}>
        <i className={icon} />
      </div>
      <div style={bstyle.label}>{label}</div>
    </button>
  );
};

SideButton.propTypes = {
  bstyle: React.PropTypes.object,
  isActive: React.PropTypes.bool,
  icon: React.PropTypes.string,
  title: React.PropTypes.string,
  label: React.PropTypes.string,
  onClick: React.PropTypes.func
};

export default Radium(SideButton);
