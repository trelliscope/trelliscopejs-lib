import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
// import marked from 'marked';
// import katex from 'katex';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { uiConstsSelector } from '../selectors';

class DisplayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  componentDidMount() {
    Mousetrap.bind(['i'], this.handleKey);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['i']);
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

    const mdDesc = '';
    // if (this.props.displayInfo.isLoaded) {
    //   mdDesc = marked(this.props.displayInfo.info.mdDesc);
    //   // mdDesc = katex.renderToString(mdDesc);
    // }

    return (
      <div
        onClick={this.handleOpen}
        style={this.props.style.button}
      >
        <i className="icon-info" style={{ paddingLeft: 2, lineHeight: '45px' }}></i>
        <Dialog
          title="Information About This Display"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div dangerouslySetInnerHTML={{ __html: mdDesc }} />
          <h3>Display Attributes</h3>
          <ul>
          </ul>
          <h3>Cognostics</h3>
          <p>To help navigate the panels, the following cognostics have been computed:</p>
          <ul>
          </ul>
          <h3>Data</h3>
          <p>The input data source is a </p>
          <p>One subset of the data looks like this:</p>
          <pre><code>
          </code></pre>
          <h3>Panel Function</h3>
          The R code that generates each panel ():
          <pre><code>
          </code></pre>
        </Dialog>
      </div>
    );
  }
}

DisplayInfo.propTypes = {
  style: React.PropTypes.object,
  selectedDisplay: React.PropTypes.object,
  displayInfo: React.PropTypes.object,
  handleClick: React.PropTypes.func
};

// ------ redux container ------

const selectedDisplaySelector = state => state.selectedDisplay;
const displayInfoSelector = state => state._displayInfo;

const styleSelector = createSelector(
  uiConstsSelector, selectedDisplaySelector, displayInfoSelector,
  (ui, selectedDisplay, displayInfo) => ({
    style: {
      button: {
        position: 'fixed',
        boxSizing: 'border-box',
        top: 0,
        transition: 'left 0.5s ease, background 250ms',
        left: selectedDisplay.name === '' ? -ui.header.height : ui.header.height,
        display: 'inline-block',
        height: ui.header.height,
        width: ui.header.height,
        fontSize: 16,
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
      }
    },
    selectedDisplay,
    displayInfo
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(Radium(DisplayInfo));
