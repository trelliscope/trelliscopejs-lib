import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import DisplayInfo from './DisplayInfo';
// import RelatedDisplays from './RelatedDisplays';
import DisplaySelect from './DisplaySelect';
import Pagination from './Pagination';
import HeaderLogo from './HeaderLogo';
import { setSelectedDisplay, fetchDisplay, setDialogOpen } from '../actions';
import { windowWidthSelector } from '../selectors/ui';
import { relatedDisplaysSelector, displayGroupsSelector } from '../selectors/display';
import { appIdSelector, configSelector, displayListSelector,
  selectedDisplaySelector, dialogOpenSelector } from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleLoaded: props.selectedDisplay.name !== '',
      singleDisplay: props.displayList.isLoaded && props.displayList.list.length <= 1
    };
  }
  componentWillReceiveProps(nprops) {
    // handle loading a single display if necessary
    const singleDisplay = nprops.displayList.isLoaded &&
        nprops.displayList.list.length <= 1;
    this.setState({ singleDisplay });

    if (!this.state.singleLoaded && singleDisplay &&
      nprops.selectedDisplay.name !== '') {
      this.setState({ singleLoaded: true });
    } else if (!this.state.singleLoaded && singleDisplay) {
      nprops.selectDisplay(
        nprops.displayList.list[0].name,
        nprops.displayList.list[0].group,
        nprops.displayList.list[0].desc,
        nprops.cfg,
        nprops.appId
      );
      this.setState({ singleLoaded: true });
    }
  }
  render() {
    const { classes } = this.props.sheet;

    let displayName = '';
    let displayDesc = '';
    let iconStyle = { visibility: 'hidden' };
    let pagination = '';
    let displaySelect = '';
    const relatedDisplays = ''; // <RelatedDisplays setDialogOpen={this.props.setDialogOpen} />
    const displayLoaded = this.props.selectedDisplay.name !== '';
    const nGroups = Object.keys(this.props.displayGroups).length;
    const listLoaded = this.props.displayList.isLoaded;

    if (listLoaded && !this.state.singleDisplay) {
      displaySelect = <DisplaySelect setDialogOpen={this.props.setDialogOpen} />;
    }

    if (displayLoaded) {
      if (nGroups > 1) {
        displayName = `${this.props.selectedDisplay.group} /
          ${this.props.selectedDisplay.name}`;
      } else {
        displayName = this.props.selectedDisplay.name;
      }
      if (!this.state.singleDisplay) {
        iconStyle = { color: '#aaa', fontSize: 12 };
      }
      displayDesc = this.props.selectedDisplay.desc;
      pagination = <Pagination />;
    } else if (this.state.singleDisplay) {
      displayName = 'loading...';
    } else if (!this.props.dialogOpen) {
      displayName = <span><i className="icon-arrow-left" /> select a display to view...</span>;
    }

    return (
      <div className={classes.headerContainer} style={this.props.styles.headerContainer}>
        {displaySelect}
        {relatedDisplays}
        <DisplayInfo
          singleDisplay={this.state.singleDisplay}
          setDialogOpen={this.props.setDialogOpen}
        />
        <i style={iconStyle} className="fa fa-info-circle" />
        <div className={classes.headerSubContainer} style={this.props.styles.headerSubContainer}>
          <div className={classes.nameDescContainer}>
            <div className={classes.displayName} style={this.props.styles.displayName}>
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
          setDialogOpen={this.props.setDialogOpen}
          singleDisplay={this.state.singleDisplay}
        />
      </div>
    );
  }
}

Header.propTypes = {
  styles: React.PropTypes.object,
  sheet: React.PropTypes.object,
  cfg: React.PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  appId: React.PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  displayList: React.PropTypes.object,
  displayGroups: React.PropTypes.object,
  selectedDisplay: React.PropTypes.object,
  dialogOpen: React.PropTypes.bool,
  selectDisplay: React.PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  setDialogOpen: React.PropTypes.func
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
  selectedDisplaySelector, relatedDisplaysSelector, configSelector, dialogOpenSelector,
  (appId, ww, dl, dg, sd, rd, cfg, dialogOpen) => ({
    styles: {
      headerContainer: {
        width: ww
      },
      headerSubContainer: {
        left: uiConsts.header.height *
          ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1)), //  + (rd.length === 0 ? 0 : 1)
        width: ww - ((uiConsts.header.height *
          ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1))) +
          uiConsts.header.logoWidth + 30)
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
    dialogOpen
  })
);

const mapStateToProps = state => (
  styleSelector(state)
);

const mapDispatchToProps = dispatch => ({
  selectDisplay: (name, group, desc, cfg, appId) => {
    dispatch(setSelectedDisplay(name, group, desc));
    dispatch(fetchDisplay(name, group, cfg, appId));
  },
  setDialogOpen: (isOpen) => {
    dispatch(setDialogOpen(isOpen));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(Header));
