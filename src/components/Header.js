import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import DisplayInfo from './DisplayInfo';
// import RelatedDisplays from './RelatedDisplays';
import DisplaySelect from './DisplaySelect';
import Pagination from './Pagination';
import HeaderLogo from './HeaderLogo';
import { setSelectedDisplay, fetchDisplay } from '../actions';
import { uiConstsSelector, windowWidthSelector } from '../selectors/ui';
import { relatedDisplaysSelector, displayGroupsSelector } from '../selectors/display';
import { configSelector, displayListSelector,
  selectedDisplaySelector } from '../selectors';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleLoaded: false
    };
  }
  componentWillReceiveProps(nprops) {
    // handle loading a single display if necessary
    if (!this.state.singleLoaded &&
      nprops.displayList.isLoaded &&
      nprops.displayList.list.length === 1) {
      nprops.selectDisplay(nprops.displayList.list[0].name,
        nprops.displayList.list[0].group, nprops.cfg);
      this.setState({ singleLoaded: true });
    }
  }
  render() {
    let displayName = '';
    let iconStyle = { visibility: 'hidden' };
    let pagination = '';
    let displaySelect = '';
    let relatedDisplays = ''; // <RelatedDisplays />
    const singleDisplay = this.props.displayList.list.length <= 1;
    const displayLoaded = this.props.selectedDisplay.name !== '';
    const nGroups = Object.keys(this.props.displayGroups).length;
    const listLoaded = this.props.displayList.isLoaded;

    if (listLoaded && !singleDisplay) {
      displaySelect = <DisplaySelect />;
    }

    if (displayLoaded) {
      if (nGroups > 1) {
        displayName = `${this.props.selectedDisplay.group} /
          ${this.props.selectedDisplay.name}`;
      } else {
        displayName = this.props.selectedDisplay.name;
      }
      if (!singleDisplay) {
        iconStyle = { color: '#aaa', fontSize: 12 };
      }
      pagination = <Pagination />;
    } else if (singleDisplay) {
      displayName = 'loading...';
    } else {
      displayName = <span><i className="icon-arrow-left" /> select a display to view...</span>;
    }

    return (
      <div style={this.props.style.outer}>
        {displaySelect}
        {relatedDisplays}
        <DisplayInfo singleDisplay={singleDisplay} />
        <div style={this.props.style.displayName}>
          {displayName} <i style={iconStyle} className="fa fa-info-circle" />
        </div>
        {pagination}
        <HeaderLogo />
      </div>
    );
  }
}

Header.propTypes = {
  style: React.PropTypes.object,
  cfg: React.PropTypes.object,
  displayList: React.PropTypes.object,
  displayGroups: React.PropTypes.object,
  selectedDisplay: React.PropTypes.object,
  selectDisplay: React.PropTypes.func
};

// ------ redux container ------

const styleSelector = createSelector(
  windowWidthSelector, uiConstsSelector, displayListSelector, displayGroupsSelector,
  selectedDisplaySelector, relatedDisplaysSelector, configSelector,
  (ww, ui, dl, dg, sd, rd, cfg) => ({
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
        transition: 'left 0.5s ease',
        left: ui.header.height *
          ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1) + (rd.length === 0 ? 0 : 1))
      }
    },
    cfg,
    displayList: dl,
    displayGroups: dg,
    selectedDisplay: sd
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  selectDisplay: (name, group, cfg) => {
    dispatch(setSelectedDisplay(name, group));
    dispatch(fetchDisplay(name, group, cfg));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Header));
