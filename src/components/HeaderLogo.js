import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import Mousetrap from 'mousetrap';
import FlatButton from 'material-ui/FlatButton';
import { emphasize } from 'material-ui/utils/colorManipulator';
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
    this.props.setDialogOpen(true);
    this.setState({ open: true });
  }
  handleKey = () => {
    this.props.setDialogOpen(true);
    this.setState({ open: true });
  }
  handleClose = () => {
    this.props.setDialogOpen(false);
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
    // only show keyboard shortcut for open display if there is more than one display
    let openDisplayTags = '';
    if (!this.props.singleDisplay) {
      openDisplayTags = (
        <li>
          <code style={this.props.style.dialog.code}>o</code>
          &ensp;open "Select Display" dialog
        </li>
      );
    }
    return (
      <button
        onClick={this.handleOpen}
        style={this.props.style.logo}
      >
        Trelliscope
        <div style={this.props.style.icon}>
          <i className="icon-help" style={this.props.style.icon} />
        </div>
        <Dialog
          title={`Trelliscope Viewer v${VERSION}`}
          actions={actions}
          open={this.state.open}
          autoScrollBodyContent
          onRequestClose={this.handleClose}
        >
          <Tabs>
            <Tab label="How to Use" >
              <div style={this.props.style.dialog.div}>
                <p>
                  TODO
                </p>
              </div>
            </Tab>
            <Tab label="Keyboard Shortcuts" >
              <div style={this.props.style.dialog.div}>
                <div>
                  <div style={{ width: '50%', display: 'block', float: 'left' }}>
                    <h4 style={this.props.style.dialog.h4}>Sidebar controls</h4>
                    <ul style={this.props.style.dialog.ul}>
                      <li>
                        <code style={this.props.style.dialog.code}>g</code>
                        &ensp;open "Grid" sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>l</code>
                        &ensp;open "Labels" sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>f</code>
                        &ensp;open "Filter" sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>s</code>
                        &ensp;open "Sort" sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>esc</code>
                        &ensp;close sidebar
                      </li>
                    </ul>
                    <h4 style={this.props.style.dialog.h4}>Panel navigation</h4>
                    <ul style={this.props.style.dialog.ul}>
                      <li>
                        <code style={this.props.style.dialog.code}>left</code>
                        &ensp;page back
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>right</code>
                        &ensp;page forward
                      </li>
                    </ul>
                  </div>
                  <div style={{ width: '50%', display: 'block', float: 'left' }}>
                    <h4 style={this.props.style.dialog.h4}>Dialog boxes</h4>
                    <ul style={this.props.style.dialog.ul}>
                      {openDisplayTags}
                      <li>
                        <code style={this.props.style.dialog.code}>i</code>
                        &ensp;open "Display Info" dialog
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>a</code>
                        &ensp;open "About" dialog
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>esc</code>
                        &ensp;close dialog
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab label="Credits" >
              <div style={this.props.style.dialog.div}>
                <p>
                  &copy;&nbsp;
                  <a
                    href="http://ryanhafen.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ryan Hafen
                  </a>, 2016.
                </p>
                <p>
                  Built with&nbsp;
                  <a
                    href="https://facebook.github.io/react/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    React
                  </a>
                  &nbsp;and several other awesome libraries listed&nbsp;
                  <a
                    href="https://github.com/hafen/TrelliscopeJS/blob/master/package.json"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>.
                </p>
                <p>
                  Source code available <a href="https://github.com/hafen/TrelliscopeJS/" target="_blank" rel="noopener noreferrer">on github</a> &ndash; submit issues and feature requests there.
                </p>
                <p>
                  Thanks to Bill Cleveland for ideas upon which this is built,
                  to Saptarshi Guha for creating a multi-panel plot viewer prototype
                  many years ago that inspired initial work,
                  and to Barret Schloerke for the introduction to React
                  and discussions about the interface.
                </p>
              </div>
            </Tab>
          </Tabs>
        </Dialog>
      </button>
    );
  }
}

HeaderLogo.propTypes = {
  style: React.PropTypes.object,
  singleDisplay: React.PropTypes.bool,
  setDialogOpen: React.PropTypes.func
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector,
  (ui) => ({
    style: {
      logo: {
        position: 'fixed',
        top: 0,
        right: 0,
        cursor: 'pointer',
        border: 'none',
        // borderColor: ui.header.borderColor,
        height: ui.header.height,
        textAlign: 'center',
        width: ui.header.titleWidth,
        fontSize: 17,
        background: ui.header.logo.background,
        color: ui.header.logo.color
      },
      icon: {
        position: 'absolute',
        top: 1,
        right: 1,
        color: emphasize(ui.header.logo.background, 0.4)
      },
      dialog: {
        headline: {
          fontSize: 24,
          paddingTop: 16,
          marginBottom: 12,
          fontWeight: 400
        },
        div: {
          fontSize: 18,
          paddingLeft: 10,
          paddingRight: 10
        },
        h4: {
          marginBottom: 5
        },
        ul: {
          marginTop: 0,
          breakInside: 'avoid-column'
        },
        code: {
          color: '#FF5252',
          fontSize: 20
        }
      }
    }
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(Radium(HeaderLogo));
