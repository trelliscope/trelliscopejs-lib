import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import marked from 'marked';
// import katex from 'katex';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { selectedDisplaySelector, displayInfoSelector } from '../selectors';
import uiConsts from '../styles/uiConsts';

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
    const { classes } = this.props.sheet;

    const actions = [
      <FlatButton
        label="Close"
        secondary
        onTouchTap={this.handleClose}
      />
    ];

    let dialogContent = '';
    if (this.props.displayInfo.isLoaded) {
      const mdDesc = marked(this.props.displayInfo.info.mdDesc, { sanitize: true });
      // mdDesc = katex.renderToString(mdDesc);
      const ci = this.props.displayInfo.info.cogInfo;
      const ciKeys = Object.keys(ci);

      let descText = '';
      if (this.props.displayInfo.info.desc) {
        descText = (
          <p>
            <strong>Description:</strong> {this.props.displayInfo.info.desc}
          </p>
        );
      }

      let panelUnitText = '';
      if (this.props.displayInfo.info.panelUnitDesc) {
        panelUnitText = (
          <p>
            Each panel of this display represents a {this.props.displayInfo.info.panelUnitDesc}
          </p>
        );
      }

      dialogContent = (
        <Dialog
          title="Information About This Display"
          actions={actions}
          modal={false}
          className="trelliscope-app"
          style={{ zIndex: 8000, fontWeight: 300 }}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className={classes.modalContainer}>
            <p>
              <strong>Dispay name:</strong> {this.props.displayInfo.info.name}
            </p>
            {descText}
            <p>
              <strong>Last updated</strong>: {this.props.displayInfo.info.updated}
            </p>
            <p>
              <strong>Number of panels</strong>: {this.props.displayInfo.info.n}
            </p>
            {panelUnitText}
            <div
              // we can dangerously set because the HTML is generated from marked()
              // with pure markdown (sanitize = TRUE so user HTML is not supported)
              dangerouslySetInnerHTML={{ __html: mdDesc }} // eslint-disable-line react/no-danger
            />
            <h3>Cognostics</h3>
            <p>
              To help navigate the panels, the following cognostics have been computed.
              For information on how to use these metrics to interact with the panels,
              please click the &quot;?&quot; icon in the top right corner of the
              application or hit the key &quot;a&quot;.
            </p>
            <ul>
              {ciKeys.map((d, i) => (
                <li key={i}>
                  <strong>{ci[d].name}</strong>: {ci[d].desc}
                </li>
              ))}
            </ul>
          </div>
        </Dialog>
      );
    }

    // <h3>Data</h3>
    // <p>The data for one subset has the following structure:</p>
    // <pre><code>
    //   {this.props.displayInfo.info.example}
    // </code></pre>
    // <h3>Panel Function</h3>
    // The R code that generates each panel:
    // <pre><code>
    //   {this.props.displayInfo.info.panelFn}
    // </code></pre>

    return (
      <button
        onTouchTap={this.handleOpen}
        className={classes.button}
        style={this.props.singleDisplay ? this.props.styles.single : this.props.styles.button}
      >
        <i className={`${classes.icon} icon-info_outline`} />
        {dialogContent}
      </button>
    );
  }
}

DisplayInfo.propTypes = {
  styles: React.PropTypes.object,
  sheet: React.PropTypes.object,
  singleDisplay: React.PropTypes.bool,
  // selectedDisplay: React.PropTypes.object,
  displayInfo: React.PropTypes.object,
  setDialogOpen: React.PropTypes.func,
  active: React.PropTypes.bool
};

// ------ static styles ------

const staticStyles = {
  button: {
    position: 'absolute',
    boxSizing: 'border-box',
    top: -1,
    // transition: 'left 0.5s ease, background 250ms',
    display: 'inline-block',
    height: uiConsts.header.height,
    width: uiConsts.header.height,
    fontSize: 18,
    paddingTop: 0,
    color: uiConsts.header.button.color,
    background: 'none',
    textAlign: 'center',
    borderRight: `1px solid ${uiConsts.header.borderColor}`,
    borderBottom: `1px solid ${uiConsts.header.borderColor}`,
    borderTop: 'none',
    borderLeft: 'none',
    '&:hover': {
      transition: 'background 250ms',
      background: '#eee',
      cursor: 'pointer'
    }
  },
  icon: {
    paddingLeft: 2,
    lineHeight: `${uiConsts.header.height}px`
  },
  modalContainer: {
    overflowY: 'auto',
    maxHeight: 520
  }
};

// ------ redux container ------

const styleSelector = createSelector(
  selectedDisplaySelector, displayInfoSelector,
  (selectedDisplay, displayInfo) => ({
    styles: {
      button: {
        left: selectedDisplay.name === '' ? -uiConsts.sideButtons.width : uiConsts.sideButtons.width
      },
      single: {
        left: selectedDisplay.name === '' ? -uiConsts.sideButtons.width : 0
      }
    },
    // selectedDisplay,
    displayInfo,
    active: selectedDisplay.name !== ''
  })
);

const mapStateToProps = state => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(injectSheet(staticStyles)(DisplayInfo));
