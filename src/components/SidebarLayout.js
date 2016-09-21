import React from 'react';
import { connect } from 'react-redux';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import Radium from 'radium';
import { createSelector } from 'reselect';
import NumericInput from './NumericInput';
import { setLayout } from '../actions';
import { uiConstsSelector } from '../selectors/ui';
import { layoutSelector, displayInfoSelector } from '../selectors';

const SidebarLayout = ({ style, layout, handleChange }) => {
  let content = <div />;
  if (layout.nrow) {
    content = (
      <div style={style.base}>
        <div style={style.row}>
          <div style={style.label}>Rows:</div>
          <div style={style.ninput}>
            <NumericInput
              arrows
              value={layout.nrow}
              size={5} min={1} step={1}
              onChange={nr =>
                handleChange({ nrow: nr, ncol: layout.ncol, arrange: layout.arrange })
              }
            />
          </div>
        </div>
        <Divider />
        <div style={style.row}>
          <div style={style.label}>Columns:</div>
          <div style={style.ninput}>
            <NumericInput
              arrows
              value={layout.ncol}
              size={5} min={1} step={1}
              onChange={nc =>
                handleChange({ nrow: layout.nrow, ncol: nc, arrange: layout.arrange })
              }
            />
          </div>
        </div>
        <Divider />
        <div style={style.row}>
          Arrangement:
        </div>
        <div style={style.row}>
          <RadioButtonGroup
            name="arrangement"
            defaultSelected={layout.arrange}
            onChange={(e, ar) => handleChange({
              nrow: layout.nrow, ncol: layout.ncol, arrange: ar
            })}
          >
            <RadioButton
              value="row"
              label={
                <span style={style.input.labelSpan}>
                  By row&nbsp;&nbsp;
                  <i className="icon-byrow" style={style.input.icon} />
                </span>}
              style={style.input.radio}
              labelStyle={style.input.label}
            />
            <RadioButton
              value="column"
              label={
                <span style={style.input.labelSpan}>
                  By column&nbsp;&nbsp;
                  <i className="icon-bycol" style={style.input.icon} />
                </span>
              }
              style={style.input.radio}
              labelStyle={style.input.label}
            />
          </RadioButtonGroup>
        </div>
      </div>
    );
  }
  return (content);
};

SidebarLayout.propTypes = {
  style: React.PropTypes.object,
  layout: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

// ------ redux container ------

const stateSelector = createSelector(
  uiConstsSelector, layoutSelector, displayInfoSelector,
  (ui, layout, di) => ({
    style: {
      base: {
        background: di.isFetching ? 'red' : 'white'
      },
      row: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 8,
        paddingBottom: 6,
        width: ui.sidebar.width - 30,
        display: 'inline-block'
      },
      label: {
        lineHeight: '28px',
        float: 'left'
      },
      ninput: {
        float: 'right'
      },
      input: {
        radio: {
          marginBottom: 5,
          marginTop: 0
        },
        label: {
          marginTop: -8
        },
        labelSpan: {
          lineHeight: '40px',
          verticalAlign: 'middle'
        },
        icon: {
          fontSize: 23,
          verticalAlign: 'text-bottom'
        }
      }
    },
    layout
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

const mapDispatchToProps = dispatch => ({
  handleChange: (layout) => {
    dispatch(setLayout(layout));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(SidebarLayout));
