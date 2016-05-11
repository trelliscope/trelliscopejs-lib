import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { uiConstsSelector, windowWidthSelector } from '../selectors';
import DisplayInfo from './DisplayInfo';
import RelatedDisplays from './RelatedDisplays';
import DisplaySelect from './DisplaySelect';
import Pagination from './Pagination';
import HeaderLogo from './HeaderLogo';
import { relatedDisplaysSelector } from '../selectors/display';

const Header = ({ style, selectedDisplay }) => {
  let displayName = '';
  let iconStyle = { visibility: 'hidden' };
  let pagination = '';
  if (selectedDisplay.name !== '') {
    displayName = `${selectedDisplay.group} /
      ${selectedDisplay.name}`;
    iconStyle = { color: '#aaa', fontSize: 12 };
    pagination = <Pagination />;
  } else {
    displayName = <span><i className="icon-arrow-left" /> select a display to view...</span>;
  }
  return (
    <div style={style.outer}>
      <DisplaySelect />
      <RelatedDisplays />
      <DisplayInfo />
      <div style={style.displayName}>
        {displayName} <i style={iconStyle} className="fa fa-info-circle" />
      </div>
      {pagination}
      <HeaderLogo />
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
  windowWidthSelector, uiConstsSelector, selectedDisplaySelector, relatedDisplaysSelector,
  (ww, ui, sd, rd) => ({
    style: {
      outer: {
        position: 'fixed',
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
      displayName: {
        display: 'inline-block',
        paddingLeft: 18,
        position: 'fixed',
        top: 0,
        transition: 'left 0.5s ease',
        left: ui.header.height *
          (1 + (sd.name === '' ? 0 : 1) + (rd.length === 0 ? 0 : 1))
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
