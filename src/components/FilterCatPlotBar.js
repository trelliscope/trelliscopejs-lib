import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { uiConstsSelector } from '../selectors/ui';

class CatBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }
  mouseOver = () => {
    this.setState({ hover: true });
  }
  mouseOut = () => {
    this.setState({ hover: false });
  }
  render() {
    const fontSize = Math.min(10, this.props.height - 6);
    const labelFontSize = Math.min(9, this.props.height - 7);
    const label = this.props.d.ct === this.props.d.mct ?
      this.props.d.mct : `${this.props.d.ct} / ${this.props.d.mct}`;
    return (
      <div
        style={[
          this.props.style.wrapper,
          this.state.hover && this.props.style.wrapperHover,
          {
            width: this.props.totWidth,
            height: this.props.height - 1
          }
        ]}
        onMouseOver={this.mouseOver}
        onMouseOut={this.mouseOut}
        onClick={this.props.handleClick}
      >
        <div
          style={[
            this.props.style.bar,
            {
              width: this.props.width,
              height: this.props.height - 1
            },
            this.props.active && this.props.style.barActive,
            this.state.hover && this.props.style.barHover,
            (this.props.allActive && !this.state.hover) && this.props.style.barAllActive
          ]}
        >
          <div
            style={[
              this.props.style.barText,
              {
                fontSize,
                lineHeight: `${this.props.height - 1}px`,
                width: this.props.width
              }
            ]}
          >
            <div style={this.props.style.barTextInner}>
              {this.props.d.id}
            </div>
          </div>
        </div>
        <div
          style={[
            this.props.style.barLabel,
            {
              labelFontSize,
              lineHeight: `${this.props.height - 1}px`
            },
            !this.state.hover && this.props.style.hidden
          ]}
        >
          {label}
        </div>
      </div>
    );
  }
}

CatBar.propTypes = {
  style: React.PropTypes.object,
  active: React.PropTypes.bool,
  allActive: React.PropTypes.bool,
  width: React.PropTypes.number,
  totWidth: React.PropTypes.number,
  height: React.PropTypes.number,
  d: React.PropTypes.object,
  handleClick: React.PropTypes.func
};


// ------ redux container ------

const stateSelector = createSelector(
  uiConstsSelector,
  (ui) => ({
    style: {
      wrapper: {
        background: 'white'
      },
      wrapperHover: {
        background: '#f6f6f6'
      },
      bar: {
        background: ui.sidebar.filter.cat.bar.color.default,
        color: ui.sidebar.filter.cat.text.color.default,
        position: 'absolute',
        left: 0
      },
      barHover: {
        background: ui.sidebar.filter.cat.bar.color.hover,
        color: ui.sidebar.filter.cat.text.color.hover
      },
      barActive: {
        background: ui.sidebar.filter.cat.bar.color.select,
        color: ui.sidebar.filter.cat.text.color.select
      },
      barAllActive: {
        background: ui.sidebar.filter.cat.bar.color.noneSelect,
        color: ui.sidebar.filter.cat.text.color.select
      },
      barLabel: {
        fontSize: 10,
        color: 'gray',
        textAlign: 'center',
        cursor: 'default',
        position: 'absolute',
        lineHeight: '19px',
        right: 4
      },
      hidden: {
        visibility: 'hidden'
      },
      barText: {
        display: 'inline-block',
        overflow: 'hidden',
        cursor: 'default'
      },
      barTextInner: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        position: 'absolute',
        left: 5,
        bottom: 0
      }
    }
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(Radium(CatBar));
