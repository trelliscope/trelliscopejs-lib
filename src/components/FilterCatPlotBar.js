import React from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import uiConsts from '../styles/uiConsts';

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
    const { classes } = this.props.sheet;

    const fontSize = Math.min(10, this.props.height - 6);
    const labelFontSize = Math.min(9, this.props.height - 7);
    const label = this.props.d.ct === this.props.d.mct ?
      this.props.d.mct : `${this.props.d.ct} / ${this.props.d.mct}`;
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={classNames({
          [classes.wrapper]: true,
          [classes.wrapperHover]: this.state.hover
        })}
        style={{
          width: this.props.totWidth,
          height: this.props.height - 1
        }}
        onMouseOver={this.mouseOver}
        onMouseOut={this.mouseOut}
        onClick={this.props.handleClick}
      >
        <div
          className={classNames({
            [classes.bar]: true,
            [classes.barHover]: this.state.hover,
            [classes.barActive]: this.props.active && !this.state.hover,
            [classes.barAllActive]: this.props.allActive && !this.state.hover
          })}
          style={{
            width: this.props.width,
            height: this.props.height - 1
          }}
        >
          <div
            className={classes.barText}
            style={{
              fontSize,
              lineHeight: `${this.props.height - 1}px`,
              width: this.props.width
            }}
          >
            <div className={classes.barTextInner}>
              {this.props.d.id}
            </div>
          </div>
        </div>
        <div
          className={classNames({
            [classes.barLabel]: true,
            [classes.hidden]: !this.state.hover
          })}
          style={{
            labelFontSize,
            lineHeight: `${this.props.height - 1}px`
          }}
        >
          {label}
        </div>
      </div>
    );
  }
}

CatBar.propTypes = {
  sheet: React.PropTypes.object,
  active: React.PropTypes.bool,
  allActive: React.PropTypes.bool,
  width: React.PropTypes.number,
  totWidth: React.PropTypes.number,
  height: React.PropTypes.number,
  d: React.PropTypes.object,
  handleClick: React.PropTypes.func
};

// ------ static styles ------

const staticStyles = {
  wrapper: {
    background: 'white'
  },
  wrapperHover: {
    background: '#f6f6f6'
  },
  bar: {
    background: uiConsts.sidebar.filter.cat.bar.color.default,
    color: uiConsts.sidebar.filter.cat.text.color.default,
    position: 'absolute',
    left: 0
  },
  barHover: {
    background: uiConsts.sidebar.filter.cat.bar.color.hover,
    color: uiConsts.sidebar.filter.cat.text.color.hover
  },
  barActive: {
    background: uiConsts.sidebar.filter.cat.bar.color.select,
    color: uiConsts.sidebar.filter.cat.text.color.select
  },
  barAllActive: {
    background: uiConsts.sidebar.filter.cat.bar.color.noneSelect,
    color: uiConsts.sidebar.filter.cat.text.color.select
  },
  barLabel: {
    fontSize: 10,
    color: '#444',
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
};

export default injectSheet(staticStyles)(CatBar);
