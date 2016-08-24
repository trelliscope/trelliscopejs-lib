import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { fade } from 'material-ui/utils/colorManipulator';
import { createSelector } from 'reselect';
import { uiConstsSelector } from '../selectors/ui';
import { setFilterView, setFilter, setLayout, setSort } from '../actions';

const FooterChip = ({ label, icon, text, index, style, type, handleStateClose }) => {
  let iconTag = '';
  if (icon !== '') {
    iconTag = <i className={icon} style={style.indIcon} />;
  }
  let textTag = '';
  if (text !== '') {
    textTag = <span style={style.text}>({text})</span>;
  }

  return (
    <div type="button" style={style.wrapper}>
      <span style={style.label}>
        {iconTag}
        {label}
        {textTag}
      </span>
      <svg
        viewBox="0 0 24 24"
        style={style.closeIcon}
        key="icon"
        onClick={() => handleStateClose({ label, index, type })}
      >
        <path
          d={
            'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 ' +
            '13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 ' +
            '10.59 15.59 7 17 8.41 13.41 12 17 15.59z'
          }
        />
      </svg>
    </div>
  );
};

FooterChip.propTypes = {
  label: React.PropTypes.string,
  icon: React.PropTypes.string,
  text: React.PropTypes.string,
  index: React.PropTypes.number,
  style: React.PropTypes.object,
  type: React.PropTypes.string,
  handleStateClose: React.PropTypes.func
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
        textDecoration: 'none',
        marginLeft: 3,
        marginTop: 4,
        padding: 0,
        outline: 'none',
        borderRadius: 10,
        whiteSpace: 'nowrap',
        width: '-webkit-fit-content',
        background: ui.footer.button.background,
        height: 22,
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        // cursor: 'pointer',
        // transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        // ':hover': {
        //   backgroundColor: emphasize('rgb(173, 216, 230)', 0.08)
        // }
      },
      label: {
        color: ui.footer.button.color,
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
        ':hover': {
          color: fade('rgba(0, 0, 0, 0.22)', 0.4),
          fill: fade('rgba(0, 0, 0, 0.22)', 0.4)
        }
      },
      indIcon: {
        paddingRight: 5
      }
    },
    ui
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleStateClose: (x) => {
    if (x.type === 'sort') {
      dispatch(setSort(x.index));
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
)(Radium(FooterChip));
