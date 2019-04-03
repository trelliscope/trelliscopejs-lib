import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import uiConsts from '../assets/styles/uiConsts';

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
    const {
      classes, width, height, d, divStyle, handleClick, active, allActive
    } = this.props;
    const { hover } = this.state;

    const fontSize = Math.min(10, height - 6);
    const labelFontSize = Math.min(9, height - 7);
    const label = d.ct === d.mct ? d.mct : `${d.ct} / ${d.mct}`;
    return (
      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div
        className={classNames({
          [classes.wrapper]: true,
          [classes.wrapperHover]: hover
        })}
        style={divStyle}
        onMouseOver={this.mouseOver}
        onFocus={this.mouseOver}
        onMouseOut={this.mouseOut}
        onBlur={this.mouseOut}
        onClick={handleClick}
      >
        <div
          className={classNames({
            [classes.bar]: true,
            [classes.barHover]: hover,
            [classes.barActive]: active && !hover,
            [classes.barAllActive]: allActive && !hover
          })}
          style={{
            width,
            height: height - 1
          }}
        >
          <div
            className={classes.barText}
            style={{
              fontSize,
              lineHeight: `${height - 1}px`,
              width
            }}
          >
            <div className={classes.barTextInner}>
              {d.id}
            </div>
          </div>
        </div>
        <div
          className={classNames({
            [classes.barLabel]: true,
            [classes.hidden]: !hover
          })}
          style={{
            labelFontSize,
            lineHeight: `${height - 1}px`
          }}
        >
          {label}
        </div>
      </div>
    );
  }
}

CatBar.propTypes = {
  classes: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  allActive: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  divStyle: PropTypes.object.isRequired,
  d: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
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
