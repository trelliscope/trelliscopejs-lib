import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import DisplayInfo from './DisplayInfo';
// import RelatedDisplays from './RelatedDisplays';
import DisplaySelect from './DisplaySelect';
import Pagination from './Pagination';
import HeaderLogo from './HeaderLogo';
import { setSelectedDisplay, fetchDisplay, setDialogOpen } from '../actions';
import { uiConstsSelector, windowWidthSelector } from '../selectors/ui';
import { relatedDisplaysSelector, displayGroupsSelector } from '../selectors/display';
import { configSelector, displayListSelector,
  selectedDisplaySelector, dialogOpenSelector } from '../selectors';

class Header extends React.Component {
  constructor(props) {
    super(props);
    // this.singleDisplay = false;
    // this.singleDisplay = true;
    // this.singleDisplay = props.displayList.isLoaded && props.displayList.list.length <= 1;
    this.state = {
      singleLoaded: false
    };
  }
  componentWillReceiveProps(nprops) {
    // handle loading a single display if necessary
    this.singleDisplay = nprops.displayList.isLoaded && nprops.displayList.list.length <= 1;
    if (!this.state.singleLoaded &&
      nprops.displayList.isLoaded &&
      this.singleDisplay) {
      nprops.selectDisplay(
        nprops.displayList.list[0].name,
        nprops.displayList.list[0].group,
        nprops.displayList.list[0].desc,
        nprops.cfg
      );
      this.setState({ singleLoaded: true });
    }
  }
  render() {
    let displayName = '';
    let displayDesc = '';
    let iconStyle = { visibility: 'hidden' };
    let pagination = '';
    let displaySelect = '';
    const relatedDisplays = ''; // <RelatedDisplays setDialogOpen={this.props.setDialogOpen} />
    const displayLoaded = this.props.selectedDisplay.name !== '';
    const nGroups = Object.keys(this.props.displayGroups).length;
    const listLoaded = this.props.displayList.isLoaded;

    if (listLoaded && !this.singleDisplay) {
      displaySelect = <DisplaySelect setDialogOpen={this.props.setDialogOpen} />;
    }

    if (displayLoaded) {
      if (nGroups > 1) {
        displayName = `${this.props.selectedDisplay.group} /
          ${this.props.selectedDisplay.name}`;
      } else {
        displayName = this.props.selectedDisplay.name;
      }
      if (!this.singleDisplay) {
        iconStyle = { color: '#aaa', fontSize: 12 };
      }
      displayDesc = this.props.selectedDisplay.desc;
      pagination = <Pagination />;
    } else if (this.singleDisplay) {
      displayName = 'loading...';
    } else if (!this.props.dialogOpen) {
      displayName = <span><i className="icon-arrow-left" /> select a display to view...</span>;
    }

    return (
      <div style={this.props.style.outer}>
        {displaySelect}
        {relatedDisplays}
        <DisplayInfo
          singleDisplay={this.singleDisplay}
          setDialogOpen={this.props.setDialogOpen}
        />
        <div style={this.props.style.displayName}>
          <i style={iconStyle} className="fa fa-info-circle" />
          {displayName}
          <span style={this.props.style.displayDesc}>{displayDesc}</span>
        </div>
        {pagination}
        <HeaderLogo
          setDialogOpen={this.props.setDialogOpen}
          singleDisplay={this.singleDisplay}
        />
      </div>
    );
  }
}

Header.propTypes = {
  style: React.PropTypes.object,
  cfg: React.PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  displayList: React.PropTypes.object,
  displayGroups: React.PropTypes.object,
  selectedDisplay: React.PropTypes.object,
  dialogOpen: React.PropTypes.bool,
  selectDisplay: React.PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  setDialogOpen: React.PropTypes.func
};

// ------ redux container ------

const styleSelector = createSelector(
  windowWidthSelector, uiConstsSelector, displayListSelector, displayGroupsSelector,
  selectedDisplaySelector, relatedDisplaysSelector, configSelector, dialogOpenSelector,
  (ww, ui, dl, dg, sd, rd, cfg, dialogOpen) => ({
    style: {
      outer: {
        position: 'fixed',
        boxSizing: 'border-box',
        top: 0,
        left: 0,
        width: ww,
        height: ui.header.height,
        background: ui.header.background,
        color: ui.header.color,
        borderBottom: '1px solid',
        borderColor: ui.header.borderColor,
        margin: 0,
        lineHeight: `${ui.header.height}px`,
        fontSize: ui.header.fontSize,
        fontWeight: 300
      },
      displayName: {
        display: 'inline-block',
        paddingLeft: 18,
        position: 'fixed',
        top: 0,
        fontSize: 17,
        // fontWeight: 400,
        // transition: 'left 0.5s ease',
        left: ui.header.height *
          ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1)) //  + (rd.length === 0 ? 0 : 1)
      },
      displayDesc: {
        fontWeight: 300,
        paddingLeft: 8,
        fontSize: 12,
        fontStyle: 'italic'
      }
    },
    cfg,
    displayList: dl,
    displayGroups: dg,
    selectedDisplay: sd,
    dialogOpen
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  selectDisplay: (name, group, desc, cfg) => {
    dispatch(setSelectedDisplay(name, group, desc));
    dispatch(fetchDisplay(name, group, cfg));
  },
  setDialogOpen: (isOpen) => {
    dispatch(setDialogOpen(isOpen));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Header));
