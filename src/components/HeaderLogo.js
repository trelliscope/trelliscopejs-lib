import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import Mousetrap from 'mousetrap';
import FlatButton from 'material-ui/FlatButton';
import { createSelector } from 'reselect';
import { uiConstsSelector } from '../selectors/ui';

class HeaderLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  componentDidMount() {
    Mousetrap.bind(['a'], this.handleKey);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['a']);
  }
  handleOpen = () => {
    this.setState({ open: true });
  }
  handleKey = () => {
    this.setState({ open: true });
  }
  handleClose = () => {
    this.setState({ open: false });
  }
  render() {
    const actions = [
      <FlatButton
        label="Close"
        secondary
        onTouchTap={this.handleClose}
      />
    ];
    return (
      <div
        onClick={this.handleOpen}
        style={this.props.style}
      >
        Trelliscope
        <Dialog
          title="About Trelliscope"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          stuff...
        </Dialog>
      </div>
    );
  }
}

HeaderLogo.propTypes = {
  style: React.PropTypes.object
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector,
  (ui) => ({
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      cursor: 'pointer',
      borderColor: ui.header.borderColor,
      height: ui.header.height,
      textAlign: 'center',
      width: ui.header.titleWidth,
      fontSize: 17,
      background: ui.header.logo.background,
      color: ui.header.logo.color
    }
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(Radium(HeaderLogo));
