import React from 'react';
import { connect } from 'react-redux';
import { NumericInput } from 'react-numeric-input';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { setLayout } from '../actions';
import { uiConstsSelector } from '../selectors';

const SidebarLayout = ({ style, layout, handleChange }) => {
  let content = <div></div>;
  if (layout.nrow) {
    content = (
      <div style={style.base}>
        <div style={style.row}>
          <div style={style.label}>Rows:</div>
          <div style={style.ninput}>
          <NumericInput
            value={layout.nrow}
            size={5} min={1} step={1}
            style={style.input}
            onChange={(nr) => handleChange({
              nrow: nr, ncol: layout.ncol, arrange: layout.arrange
            })}
          />
          </div>
        </div>
        <Divider />
        <div style={style.row}>
          <div style={style.label}>Columns:</div>
          <div style={style.ninput}>
          <NumericInput
            value={layout.ncol}
            size={5} min={1} step={1}
            style={style.input}
            onChange={(nc) => handleChange({
              nrow: layout.nrow, ncol: nc, arrange: layout.arrange
            })}
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
              label="By row"
              style={style.radio}
            />
            <RadioButton
              value="column"
              label="By column"
              style={style.radio}
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
  labels: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

// ------ redux container ------

const layoutSelector = state => state.layout;
const dispSelector = state => state.currentDisplay.displayInfo;

const stateSelector = createSelector(
  uiConstsSelector, layoutSelector, dispSelector,
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
        wrap: {
          borderRadius: 0,
          fontSize: 13
        },
        input: {
          height: 28,
          fontSize: 15,
          borderRadius: 0,
          fontFamily: '"Open Sans", sans-serif',
          padding: 10,
          border: '1px solid #ccc',
          display: 'block'
        },
        btn: {
          boxShadow: 'none',
          cursor: 'pointer'
        }
      },
      radio: {
        marginBottom: 5,
        marginTop: 0
      }
    },
    layout
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (layout) => {
    dispatch(setLayout(layout));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(SidebarLayout));
