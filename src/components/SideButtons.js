import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { setActiveSidebar } from '../actions';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import '../../node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.js';
import { uiConstsSelector, sidebarActiveSelector, contentHeightSelector } from '../selectors';
import SideButton from './SideButton';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT,
  SB_PANEL_LABELS, SB_CONFIG } from '../constants.js';

const buttons = [
  { icon: 'fa fa-th', title: SB_PANEL_LAYOUT, key: 'g' },
  { icon: 'fa fa-list-ul', title: SB_PANEL_LABELS, key: 'l' },
  { icon: 'fa fa-filter', title: SB_PANEL_FILTER, key: 'f' },
  { icon: 'fa fa-sort-amount-asc', title: SB_PANEL_SORT, key: 's' },
  { icon: 'fa fa-cog', title: SB_CONFIG, key: 'c' }
];

class SideButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, displayList: [], open: false };
  }
  componentDidMount() {
    Mousetrap.bindGlobal(['g', 'l', 'f', 's', 'c', 'esc', 'enter'], this.handleKey);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['g', 'l', 'f', 's', 'c', 'esc', 'enter']);
  }
  handleKey = (e, k) => {
    // allow keyboard shortcuts for sidebars
    // if 'esc', close it, otherwise, open according to key code
    if (k === 'esc' || k === 'enter') {
      this.props.setActive('');
    } else {
      const which = [];
      for (let ii = 0; ii < buttons.length; ii++) {
        if (buttons[ii].key === k) {
          which.push(buttons[ii].title);
        }
      }
      if (which.length > 0) {
        this.props.setActive(which[0]);
      }
    }
  }
  render() {
    return (
      <div style={this.props.style.base}>
        <div style={this.props.style.spacer}></div>
        {buttons.map((d, i) => (
          <SideButton
            key={`sidebutton-${i}`}
            bstyle={this.props.buttonStyle}
            isActive={d.title === this.props.active}
            icon={d.icon}
            title={d.title}
            onClick={() => this.props.setActive(d.title)}
          />
        ))}
      </div>
    );
  }
}

SideButtons.propTypes = {
  style: React.PropTypes.object,
  active: React.PropTypes.string,
  buttonStyle: React.PropTypes.object,
  setActive: React.PropTypes.func
};

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector, uiConstsSelector, sidebarActiveSelector,
  (ch, ui, active) => ({
    style: {
      base: {
        position: 'absolute',
        left: 0,
        top: ui.header.height,
        width: ui.sideButtons.width,
        height: ch,
        background: ui.sideButtons.background,
        zIndex: 1000
      },
      spacer: {
        transition: 'height 0.2s',
        height: ui.sidebar.header.height,
        width: ui.sideButtons.width,
        background: ui.sideButtons.spacerBackground
      }
    },
    width: ui.sideButtons.width,
    buttonStyle: {
      base: {
        width: ui.sideButtons.width,
        height: ui.sideButtons.width,
        lineHeight: `${ui.sideButtons.width}px`,
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: ui.sideButtons.width * 0.5,
        color: ui.sideButtons.button.color,
        borderBottom: '1px solid',
        borderColor: ui.sideButtons.button.borderColor,
        userSelect: 'none',
        transition: 'color 0.2s, background 0.2s',
        ':hover': {
          transition: 'color 0.2s, background 0.2s',
          background: ui.sideButtons.button.hover.background,
          cursor: 'pointer'
        }
      },
      active: {
        transition: 'color 0.2s, background 0.2s',
        background: 'white',
        color: ui.sideButtons.button.active.color,
        ':hover': {
          transition: 'color 0.2s, background 0.2s',
          background: ui.sideButtons.button.active.background
        }
      }
    },
    active
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  setActive: (n) => {
    dispatch(setActiveSidebar(n));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(SideButtons));
