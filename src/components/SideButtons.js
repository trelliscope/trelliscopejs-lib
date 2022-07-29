import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import { setActiveSidebar } from '../actions';
import '../../node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind';
import SideButton from './SideButton';
import {
  SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_VIEWS
} from '../constants';
import { sidebarActiveSelector, contentHeightSelector } from '../selectors/ui';
import { dialogOpenSelector, fullscreenSelector, curDisplayInfoSelector } from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

const buttons = [
  {
    icon: 'icon-th', label: 'Grid', title: SB_PANEL_LAYOUT, key: 'g'
  },
  {
    icon: 'icon-list-ul', label: 'Labels', title: SB_PANEL_LABELS, key: 'l'
  },
  {
    icon: 'icon-filter', label: 'Filter', title: SB_PANEL_FILTER, key: 'f'
  },
  {
    icon: 'icon-sort-amount-asc', label: 'Sort', title: SB_PANEL_SORT, key: 's'
  },
  {
    icon: 'icon-views', label: 'Views', title: SB_VIEWS, key: 'v'
  }
  // { icon: 'icon-cog', label: 'Config', title: SB_CONFIG, key: 'c' }
];

class SideButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // loaded: false,
      // displayList: [],
      // open: false
    };
  }

  componentDidMount() {
    const { fullscreen, active } = this.props;
    if (fullscreen) {
      Mousetrap.bind(['g', 'l', 'f', 's', 'c', 'v', 'enter'], this.handleKey);
      if (active !== '') {
        Mousetrap.bindGlobal('esc', this.handleKey);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    if (nextProps.fullscreen) {
      Mousetrap.bind(['g', 'l', 'f', 's', 'c', 'v', 'enter'], this.handleKey);
      if (nextProps.active !== '') {
        Mousetrap.bindGlobal('esc', this.handleKey);
      }
    } else {
      Mousetrap.unbind(['g', 'l', 'f', 's', 'c', 'v', 'esc', 'enter']);
    }
  }

  componentWillUnmount() {
    const { fullscreen } = this.props;
    if (fullscreen) {
      Mousetrap.unbind(['g', 'l', 'f', 's', 'c', 'v', 'esc', 'enter']);
    }
  }

  handleKey = (e, k) => {
    const { dialogOpen, setActive, hasViews } = this.props;

    if (k === 'v' && !hasViews) {
      return;
    }

    if (e.target.nodeName === 'INPUT' || dialogOpen) {
      e.stopPropagation();
    } else if (k === 'esc' || k === 'enter') {
      // allow keyboard shortcuts for sidebars
      // if 'esc', close it, otherwise, open according to key code
      setActive('');
    } else {
      const which = [];
      for (let ii = 0; ii < buttons.length; ii += 1) {
        if (buttons[ii].key === k) {
          which.push(buttons[ii].title);
        }
      }
      if (which.length > 0) {
        setActive(which[0]);
      }
    }
  }

  render() {
    const {
      classes, styles, active, hasViews, setActive
    } = this.props;

    return (
      <div className={classes.sideButtonsContainer} style={styles.sideButtonsContainer}>
        <div className={classes.spacer} />
        {buttons.map((d) => {
          if (d.label === 'Views' && !hasViews) {
            return '';
          }
          return (
            <SideButton
              key={`sidebutton_${d.title}`}
              isActive={d.title === active}
              icon={d.icon}
              title={d.title}
              label={d.label}
              onClick={() => setActive(d.title)}
            />
          );
        })}
      </div>
    );
  }
}

SideButtons.propTypes = {
  styles: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  active: PropTypes.string.isRequired,
  hasViews: PropTypes.bool.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  sideButtonsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingTop: uiConsts.header.height,
    width: uiConsts.sideButtons.width,
    background: uiConsts.sideButtons.background,
    boxSizing: 'border-box',
    zIndex: 1000
  },
  spacer: {
    transition: 'height 0.2s',
    height: uiConsts.sidebar.header.height,
    width: uiConsts.sideButtons.width,
    background: uiConsts.sideButtons.spacerBackground
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector, sidebarActiveSelector, dialogOpenSelector,
  fullscreenSelector, curDisplayInfoSelector,
  (ch, active, dialogOpen, fullscreen, cdi) => ({
    styles: {
      sideButtonsContainer: {
        height: ch + uiConsts.header.height
      }
    },
    width: uiConsts.sideButtons.width,
    active,
    dialogOpen,
    fullscreen,
    hasViews: (cdi.info && cdi.info.views && cdi.info.views.length > 0) || false
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
)(injectSheet(staticStyles)(SideButtons));
