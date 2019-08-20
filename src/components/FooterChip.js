import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { fade } from '@material-ui/core/styles/colorManipulator';
import {
  setFilterView, setFilter, setLayout, setSort
} from '../actions';
import uiConsts from '../assets/styles/uiConsts';

const FooterChip = ({
  classes, label, icon, text, index, type, handleStateClose
}) => {
  let iconTag = '';
  if (icon !== '') {
    iconTag = <i className={`${icon} ${classes.indIcon}`} />;
  }
  let textTag = '';
  if (text !== '') {
    textTag = (
      <span className={classes.text}>
        {`(${text})`}
      </span>
    );
  }

  return (
    <div type="button" className={classes.wrapper}>
      <span className={classes.label}>
        {iconTag}
        {label}
        {textTag}
      </span>
      <svg
        viewBox="0 0 24 24"
        className={classes.closeIcon}
        key="icon"
        onClick={() => handleStateClose({ label, index, type })}
      >
        <path
          d={
            'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 '
            + '13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 '
            + '10.59 15.59 7 17 8.41 13.41 12 17 15.59z'
          }
        />
      </svg>
    </div>
  );
};

FooterChip.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  handleStateClose: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  wrapper: {
    border: 10,
    boxSizing: 'border-box',
    display: 'flex',
    textDecoration: 'none',
    marginLeft: 3,
    marginTop: 4,
    padding: 0,
    outline: 'none',
    borderRadius: 10,
    whiteSpace: 'nowrap',
    width: '-webkit-fit-content',
    background: uiConsts.footer.button.background,
    height: 22,
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    // cursor: 'pointer',
    // transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    // '&:hover': {
    //   backgroundColor: emphasize('rgb(173, 216, 230)', 0.08)
    // }
  },
  label: {
    color: uiConsts.footer.button.color,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: '20px',
    paddingLeft: 12,
    paddingRight: 12,
    whiteSpace: 'nowrap',
    WebkitUserSelect: 'none'
  },
  text: {
    paddingLeft: 5,
    fontSize: 11,
    fontStyle: 'italic'
  },
  closeIcon: {
    display: 'inline-block',
    color: 'rgba(0, 0, 0, 0.22)',
    fill: 'rgba(0, 0, 0, 0.22)',
    height: 21,
    width: 21,
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    cursor: 'pointer',
    margin: '1px 1px 0px -8px',
    WebkitUserSelect: 'none',
    '&:hover': {
      color: fade('rgba(0, 0, 0, 0.22)', 0.4),
      fill: fade('rgba(0, 0, 0, 0.22)', 0.4)
    }
  },
  indIcon: {
    paddingRight: 5
  }
};

// ------ redux container ------

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  handleStateClose: (x) => {
    if (x.type === 'sort') {
      dispatch(setSort(x.index));
      dispatch(setLayout({ pageNum: 1 }));
    } else if (x.type === 'filter') {
      dispatch(setFilterView(x.label, 'remove'));
      dispatch(setFilter(x.label));
      dispatch(setLayout({ pageNum: 1 }));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(FooterChip));
