import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { emphasize, fade } from 'material-ui/utils/colorManipulator';
import { createSelector } from 'reselect';
import { uiConstsSelector } from '../selectors';

const FooterChip = ({ label, style }) => (
  <div type="button" style={style.wrapper} key="label">
    <span style={style.label}>
      {label}
    </span>
    <svg viewBox="0 0 24 24" style={style.icon} key="icon">
      <path
        d={
          'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 ' +
          '13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 ' +
          '10.59 15.59 7 17 8.41 13.41 12 17 15.59z'
        }
      >
      </path>
    </svg>
  </div>
);

FooterChip.propTypes = {
  label: React.PropTypes.string,
  style: React.PropTypes.object
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector,
  (ui) => ({
    style: {
      wrapper: {
        border: 10,
        boxSizing: 'border-box',
        display: 'flex',
        cursor: 'pointer',
        textDecoration: 'none',
        marginLeft: 3,
        marginTop: 4,
        padding: 0,
        outline: 'none',
        borderRadius: 10,
        whiteSpace: 'nowrap',
        width: '-webkit-fit-content',
        height: 22,
        transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        backgroundColor: 'rgb(173, 216, 230)',
        ':hover': {
          backgroundColor: emphasize('rgb(173, 216, 230)', 0.08)
        }
      },
      label: {
        color: 'white',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '20px',
        paddingLeft: 12,
        paddingRight: 12,
        whiteSpace: 'nowrap',
        WebkitUserSelect: 'none'
      },
      icon: {
        display: 'inline-block',
        color: 'rgba(0, 0, 0, 0.22)',
        fill: 'rgba(0, 0, 0, 0.22)',
        height: 21,
        width: 21,
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        cursor: 'pointer',
        margin: '1px 1px 0px -8px',
        WebkitUserSelect: 'none',
        ':hover': {
          color: fade('rgba(0, 0, 0, 0.22)', 0.4),
          fill: fade('rgba(0, 0, 0, 0.22)', 0.4)
        }
      }
    },
    ui
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Radium(FooterChip));
