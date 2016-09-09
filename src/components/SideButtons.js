import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import { setActiveSidebar } from '../actions';
import '../../node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.js';
import SideButton from './SideButton';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT,
  SB_PANEL_LABELS } from '../constants.js';
import { uiConstsSelector, sidebarActiveSelector, contentHeightSelector } from '../selectors/ui';
import { dialogOpenSelector } from '../selectors';

const buttons = [
  { icon: 'icon-th', label: 'Grid', title: SB_PANEL_LAYOUT, key: 'g' },
  { icon: 'icon-list-ul', label: 'Labels', title: SB_PANEL_LABELS, key: 'l' },
  { icon: 'icon-filter', label: 'Filter', title: SB_PANEL_FILTER, key: 'f' },
  { icon: 'icon-sort-amount-asc', label: 'Sort', title: SB_PANEL_SORT, key: 's' }
  // { icon: 'icon-cog', label: 'Config', title: SB_CONFIG, key: 'c' }
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
    if (e.target.nodeName === 'INPUT' || this.props.dialogOpen) {
      e.stopPropagation();
    } else if (k === 'esc' || k === 'enter') {
      // allow keyboard shortcuts for sidebars
      // if 'esc', close it, otherwise, open according to key code
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
        <div style={this.props.style.spacer} />
        {buttons.map((d, i) => (
          <SideButton
            key={`sidebutton-${i}`}
            bstyle={this.props.buttonStyle}
            isActive={d.title === this.props.active}
            icon={d.icon}
            title={d.title}
            label={d.label}
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
  dialogOpen: React.PropTypes.bool,
  setActive: React.PropTypes.func
};

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector, uiConstsSelector, sidebarActiveSelector, dialogOpenSelector,
  (ch, ui, active, dialogOpen) => ({
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
        position: 'relative',
        width: ui.sideButtons.width,
        height: ui.sideButtons.width,
        lineHeight: `${ui.sideButtons.width}px`,
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: ui.sideButtons.fontSize,
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
      },
      icon: {
        lineHeight: `${ui.sideButtons.fontSize}px`,
        height: ui.sideButtons.fontSize,
        width: ui.sideButtons.width,
        position: 'absolute',
        top: 8,
        left: 0
      },
      label: {
        fontSize: ui.sideButtons.labelFontSize,
        lineHeight: `${ui.sideButtons.labelFontSize}px`,
        width: ui.sideButtons.width,
        // opacity: 0.6,
        position: 'absolute',
        bottom: 4,
        left: 0
      }
    },
    active,
    dialogOpen
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
