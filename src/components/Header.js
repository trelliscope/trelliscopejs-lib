import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import DisplayInfo from './DisplayInfo';
import RelatedDisplays from './RelatedDisplays';
import DisplaySelect from './DisplaySelect';
import Pagination from './Pagination';
import HeaderLogo from './HeaderLogo';
import { setSelectedDisplay, fetchDisplay, setDialogOpen } from '../actions';
import { windowWidthSelector } from '../selectors/ui';
import { relatedDisplayGroupsSelector, displayGroupsSelector } from '../selectors/display';
import {
  appIdSelector, configSelector, displayListSelector,
  selectedDisplaySelector, dialogOpenSelector
} from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleLoaded: props.selectedDisplay.name !== '',
      singleDisplay: props.displayList.isLoaded && props.displayList.list.length <= 1
    };
  }

  UNSAFE_componentWillReceiveProps(nprops) { // eslint-disable-line camelcase
    const { singleLoaded } = this.state;
    // handle loading a single display if necessary
    // TODO: Why do this here? Why not in actions/index.js?
    const singleDisplay = nprops.displayList.isLoaded && nprops.displayList.list.length <= 1;
    this.setState({ singleDisplay });

    if (!singleLoaded && singleDisplay && nprops.selectedDisplay.name !== '') {
      this.setState({ singleLoaded: true });
    } else if (!singleLoaded && singleDisplay) {
      nprops.selectDisplay(
        nprops.displayList.list[0].name,
        nprops.displayList.list[0].group,
        nprops.displayList.list[0].desc,
        nprops.cfg,
        nprops.appId,
        window.location.hash
      );
      this.setState({ singleLoaded: true });
    }
  }

  render() {
    const {
      classes, styles, displayList, selectedDisplay, relatedDisplayGroups,
      displayGroups, doSetDialogOpen, dialogOpen
    } = this.props;
    const { singleDisplay } = this.state;

    let displayName = '';
    let displayDesc = '';
    let iconStyle = { visibility: 'hidden' };
    let pagination = '';
    let displaySelect = '';
    let relatedDisplayButton = '';
    if (relatedDisplayGroups && Object.keys(relatedDisplayGroups).length > 0) {
      relatedDisplayButton = (<RelatedDisplays setDialogOpen={doSetDialogOpen} />);
    }
    const displayLoaded = selectedDisplay.name !== '';
    const nGroups = Object.keys(displayGroups).length;
    const listLoaded = displayList.isLoaded;

    if (listLoaded && !singleDisplay) {
      displaySelect = <DisplaySelect setDialogOpen={doSetDialogOpen} />;
    }

    if (displayLoaded) {
      if (nGroups > 1) {
        displayName = `${selectedDisplay.group} /
          ${selectedDisplay.name}`;
      } else {
        displayName = selectedDisplay.name.replace(/_/g, ' ');
      }
      if (!singleDisplay) {
        iconStyle = { color: '#aaa', fontSize: 12 };
      }
      displayDesc = selectedDisplay.desc;
      pagination = <Pagination />;
    } else if (singleDisplay) {
      displayName = 'loading...';
    } else if (!dialogOpen && displayList.list.length > 0) {
      displayName = (
        <span>
          <i className="icon-arrow-left" />
          &nbsp;select a display to view...
        </span>
      );
    }

    return (
      <div className={classes.headerContainer} style={styles.headerContainer}>
        {displaySelect}
        {relatedDisplayButton}
        <DisplayInfo
          singleDisplay={singleDisplay}
          setDialogOpen={doSetDialogOpen}
        />
        <i style={iconStyle} className="fa fa-info-circle" />
        <div className={classes.headerSubContainer} style={styles.headerSubContainer}>
          <div className={classes.nameDescContainer}>
            <div className={classes.displayName} style={styles.displayName}>
              {displayName}
            </div>
            <div className={classes.displayDesc}>
              {displayDesc}
            </div>
          </div>
          <div className={classes.paginationContainer}>
            {pagination}
          </div>
        </div>
        <HeaderLogo
          setDialogOpen={doSetDialogOpen}
          singleDisplay={singleDisplay}
        />
      </div>
    );
  }
}

Header.propTypes = {
  styles: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  cfg: PropTypes.object.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  appId: PropTypes.string.isRequired,
  displayList: PropTypes.object.isRequired,
  displayGroups: PropTypes.object.isRequired,
  selectedDisplay: PropTypes.object.isRequired,
  relatedDisplayGroups: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  selectDisplay: PropTypes.func.isRequired,
  doSetDialogOpen: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  headerContainer: {
    position: 'absolute',
    boxSizing: 'border-box',
    top: 0,
    left: 0,
    height: uiConsts.header.height,
    background: uiConsts.header.background,
    color: uiConsts.header.color,
    borderBottom: `1px solid ${uiConsts.header.borderColor}`,
    borderTop: `1px solid ${uiConsts.header.borderColor}`,
    borderLeft: `1px solid ${uiConsts.header.borderColor}`,
    margin: 0,
    fontSize: uiConsts.header.fontSize,
    fontWeight: 300,
    zIndex: 1010
  },
  headerSubContainer: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    height: uiConsts.header.height
  },
  nameDescContainer: {
    flex: '1 0',
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  paginationContainer: {
    // flex: '0 0'
  },
  displayName: {
    verticalAlign: 'top',
    paddingLeft: 15,
    fontSize: 17,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
    // fontWeight: 400,
    // transition: 'left 0.5s ease',
  },
  displayDesc: {
    verticalAlign: 'top',
    fontWeight: 300,
    paddingLeft: 15,
    paddingRight: 8,
    fontSize: 10,
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

// ------ redux container ------

const styleSelector = createSelector(
  appIdSelector, windowWidthSelector, displayListSelector, displayGroupsSelector,
  selectedDisplaySelector, relatedDisplayGroupsSelector, configSelector, dialogOpenSelector,
  (appId, ww, dl, dg, sd, rdg, cfg, dialogOpen) => ({
    styles: {
      headerContainer: {
        width: ww
      },
      headerSubContainer: {
        left: uiConsts.header.height
          * ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1) + (Object.keys(rdg).length === 0 ? 0 : 1)),
        width: ww - ((uiConsts.header.height
          * ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1) + (Object.keys(rdg).length === 0 ? 0 : 1))
            + uiConsts.header.logoWidth + 30))
      },
      displayName: {
        lineHeight: `${sd.desc === '' ? 48 : 26}px`,
        paddingTop: sd.desc === '' ? 0 : 5
      }
    },
    appId,
    cfg,
    displayList: dl,
    displayGroups: dg,
    selectedDisplay: sd,
    relatedDisplayGroups: rdg,
    dialogOpen
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  selectDisplay: (name, group, desc, cfg, appId, hash) => {
    dispatch(setSelectedDisplay(name, group, desc));
    dispatch(fetchDisplay(name, group, cfg, appId, hash));
  },
  doSetDialogOpen: (isOpen) => {
    dispatch(setDialogOpen(isOpen));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(Header));
