import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import marked from 'marked';
// import katex from 'katex';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { selectedDisplaySelector, displayInfoSelector } from '../selectors';
import { uiConstsSelector } from '../selectors/ui';

class DisplayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  componentDidMount() {
    if (this.props.active) {
      Mousetrap.bind(['i'], this.handleKey);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      Mousetrap.bind(['i'], this.handleKey);
    }
  }
  componentWillUnmount() {
    if (this.props.active) {
      Mousetrap.unbind(['i']);
    }
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

    let dialogContent = '';
    if (this.props.displayInfo.isLoaded) {
      const mdDesc = marked(this.props.displayInfo.info.mdDesc);
      // mdDesc = katex.renderToString(mdDesc);
      const ci = this.props.displayInfo.info.cogInfo;
      const ciKeys = Object.keys(ci);

      dialogContent = (
        <Dialog
          title="Information About This Display"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div style={this.props.style.modal.container}>
            <div dangerouslySetInnerHTML={{ __html: mdDesc }} />
            <h3>Display Attributes</h3>
            <ul>
              <li>
                <strong>name</strong>: {this.props.displayInfo.info.name}
              </li>
              <li>
                <strong>description</strong>: {this.props.displayInfo.info.desc}
              </li>
              <li>
                <strong>updated</strong>: {this.props.displayInfo.info.updated}
              </li>
              <li>
                <strong># panels</strong>: {this.props.displayInfo.info.n}
              </li>
            </ul>
            <h3>Cognostics</h3>
            <p>To help navigate the panels, the following cognostics have been computed:</p>
            <ul>
              {ciKeys.map((d, i) => (
                <li key={i}>
                  <strong>{ci[d].name}</strong>: {ci[d].desc}
                </li>
              ))}
            </ul>
            <h3>Data</h3>
            <p>The data for one subset has the following structure:</p>
            <pre><code>
            {this.props.displayInfo.info.example}
            </code></pre>
            <h3>Panel Function</h3>
            The R code that generates each panel:
            <pre><code>
            {this.props.displayInfo.info.panelFn}
            </code></pre>
          </div>
        </Dialog>
      );
    }

    return (
      <div
        onClick={this.handleOpen}
        style={[
          this.props.style.button,
          this.props.singleDisplay && this.props.style.single
        ]}
      >
        <i className="icon-info2" style={this.props.style.icon} />
        {dialogContent}
      </div>
    );
  }
}

DisplayInfo.propTypes = {
  style: React.PropTypes.object,
  singleDisplay: React.PropTypes.bool,
  selectedDisplay: React.PropTypes.object,
  displayInfo: React.PropTypes.object,
  handleClick: React.PropTypes.func,
  active: React.PropTypes.bool
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector, selectedDisplaySelector, displayInfoSelector,
  (ui, selectedDisplay, displayInfo) => ({
    style: {
      button: {
        position: 'fixed',
        boxSizing: 'border-box',
        top: 0,
        // transition: 'left 0.5s ease, background 250ms',
        left: selectedDisplay.name === '' ? -ui.sideButtons.width : ui.sideButtons.width,
        display: 'inline-block',
        height: ui.header.height,
        width: ui.header.height,
        fontSize: 18,
        lineHeight: `${ui.header.height}px`,
        color: ui.header.button.color,
        background: 'white',
        textAlign: 'center',
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: ui.header.borderColor,
        ':hover': {
          transition: 'background 250ms',
          background: '#eee',
          cursor: 'pointer'
        }
      },
      single: {
        left: selectedDisplay.name === '' ? -ui.sideButtons.width : 0
      },
      icon: {
        paddingLeft: 2,
        lineHeight: `${ui.header.height}px`
      },
      modal: {
        container: {
          overflowY: 'auto',
          maxHeight: 520
        }
      }
    },
    selectedDisplay,
    displayInfo,
    active: selectedDisplay.name !== ''
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(Radium(DisplayInfo));
