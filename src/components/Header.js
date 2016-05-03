import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { uiConstsSelector, windowWidthSelector } from '../selectors';
import DisplaySelect from './DisplaySelect';

const Header = ({ style, selectedDisplay }) => {
  let displayName = '';
  let iconStyle = { visibility: 'hidden' };
  if (selectedDisplay.name !== '') {
    displayName = `${selectedDisplay.group} /
      ${selectedDisplay.name}`;
    iconStyle = { color: '#aaa', fontSize: 12 };
  } else {
    displayName = <span><i className="fa fa-long-arrow-left" /> select a display to view...</span>;
  }
  // <div style={style.logo}>logo</div>
  return (
    <div style={style.outer}>
      <DisplaySelect />
      <div style={style.display}>
        {displayName} <i style={iconStyle} className="fa fa-info-circle" />
      </div>
      <div style={style.title}>Trelliscope</div>
    </div>
  );
};

Header.propTypes = {
  style: React.PropTypes.object,
  selectedDisplay: React.PropTypes.object
};

// ------ redux container ------

const selectedDisplaySelector = state => state.selectedDisplay;

const styleSelector = createSelector(
  windowWidthSelector, uiConstsSelector, selectedDisplaySelector,
  (ww, ui, sd) => ({
    style: {
      outer: {
        position: 'absolute',
        boxSizing: 'border-box',
        top: 0,
        left: 0,
        width: ww,
        height: ui.header.height,
        background: ui.header.background,
        color: ui.header.color,
        borderBottom: '1px solid',
        borderColor: ui.header.borderColor,
        margin: 0,
        lineHeight: `${ui.header.height}px`,
        fontSize: ui.header.fontSize,
        fontWeight: 300
      },
      logo: {
        width: ui.sideButtons.width,
        height: ui.header.height,
        boxSizing: 'border-box',
        color: '#ccc',
        background: '#eee',
        textAlign: 'center',
        lineHeight: `${ui.sideButtons.width - 1}px`,
        display: 'inline-block'
      },
      title: {
        position: 'absolute',
        top: 0,
        right: 0,
        // display: 'inline-block',
        borderColor: ui.header.borderColor,
        height: ui.header.height,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 17,
        background: '#FF4308',
        color: 'white'
      },
      display: {
        display: 'inline-block',
        paddingLeft: 18
      }
    },
    selectedDisplay: sd
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Radium(Header));
