import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import marked from 'marked';
// import katex from 'katex';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {
  selectedDisplaySelector, curDisplayInfoSelector, fullscreenSelector
} from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

const moptions = {
  passoverHTML: false,
  passoverAttribute: 'passover',
  stripPassoverAttribute: true
};

class DisplayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  componentDidMount() {
    const { active, fullscreen } = this.props;
    if (active && fullscreen) {
      Mousetrap.bind('i', this.handleKey);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    if (nextProps.active && nextProps.fullscreen) {
      Mousetrap.bind('i', this.handleKey);
    } else {
      Mousetrap.unbind('i');
    }
  }

  componentWillUnmount() {
    const { active, fullscreen } = this.props;
    if (active && fullscreen) {
      Mousetrap.unbind('i');
    }
  }

  handleOpen = () => {
    const { setDialogOpen } = this.props;
    setDialogOpen(true);
    this.setState({ open: true });
    Mousetrap.bind('esc', this.handleClose);
  }

  handleKey = () => {
    const { setDialogOpen } = this.props;
    setDialogOpen(true);
    this.setState({ open: true });
    Mousetrap.bind('esc', this.handleClose);
  }

  handleClose = () => {
    const { setDialogOpen } = this.props;
    setDialogOpen(false);
    this.setState({ open: false });
    Mousetrap.unbind('esc');
  }

  render() {
    const {
      classes, curDisplayInfo, singleDisplay, styles
    } = this.props;

    let dialogContent = '';
    if (curDisplayInfo.isLoaded) {
      const mdDesc = marked(curDisplayInfo.info.mdDesc, moptions);
      // mdDesc = katex.renderToString(mdDesc);
      const ci = curDisplayInfo.info.cogInfo;
      const ciKeys = Object.keys(ci);

      let descText = '';
      if (curDisplayInfo.info.desc) {
        descText = (
          <p>
            <strong>Description: </strong>
            {curDisplayInfo.info.desc}
          </p>
        );
      }

      let panelUnitText = '';
      if (curDisplayInfo.info.panelUnitDesc) {
        panelUnitText = (
          <p>
            Each panel of this display represents a
            {curDisplayInfo.info.panelUnitDesc}
          </p>
        );
      }

      const { open } = this.state;
      dialogContent = (
        <Dialog
          open={open}
          className="trelliscope-app"
          style={{ zIndex: 8000, fontWeight: 300 }}
          aria-labelledby="dialog-info-title"
          onBackdropClick={this.handleClose}
          disableEscapeKeyDown
          maxWidth="md"
        >
          <DialogTitle id="dialog-info-title">Information About This Display</DialogTitle>
          <DialogContent>
            <div className={classes.modalContainer}>
              <p>
                <strong>Dispay name: </strong>
                {curDisplayInfo.info.name}
              </p>
              {descText}
              <p>
                <strong>Last updated: </strong>
                {curDisplayInfo.info.updated}
              </p>
              {/* <p>
                <strong>Number of panels: </strong>
                {curDisplayInfo.info.n}
              </p> */}
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
                {ciKeys.map((d) => (
                  <li key={ci[d].name}>
                    <strong>{`${ci[d].name}: `}</strong>
                    {ci[d].desc}
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    // <h3>Data</h3>
    // <p>The data for one subset has the following structure:</p>
    // <pre><code>
    //   {displayInfo.info.example}
    // </code></pre>
    // <h3>Panel Function</h3>
    // The R code that generates each panel:
    // <pre><code>
    //   {displayInfo.info.panelFn}
    // </code></pre>

    return (
      <div>
        <button
          type="button"
          onClick={this.handleOpen}
          className={classes.button}
          style={singleDisplay ? styles.single : styles.button}
        >
          <i className={`${classes.icon} icon-info_outline`} />
        </button>
        {dialogContent}
      </div>
    );
  }
}

DisplayInfo.propTypes = {
  styles: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  singleDisplay: PropTypes.bool.isRequired,
  // selectedDisplay: PropTypes.object.isRequired,
  curDisplayInfo: PropTypes.object.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired
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
    width: uiConsts.header.height - 1,
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
  selectedDisplaySelector, curDisplayInfoSelector, fullscreenSelector,
  (selectedDisplay, curDisplayInfo, fullscreen) => ({
    styles: {
      button: {
        left: selectedDisplay.name === '' ? -uiConsts.sideButtons.width : uiConsts.sideButtons.width
      },
      single: {
        left: selectedDisplay.name === '' ? -uiConsts.sideButtons.width : 0
      }
    },
    // selectedDisplay,
    curDisplayInfo,
    fullscreen,
    active: selectedDisplay.name !== ''
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(DisplayInfo));
