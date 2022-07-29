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
  selectedDisplaySelector, curDisplayInfoSelector, fullscreenSelector,
  dispInfoDialogSelector
} from '../selectors';
import { setDispInfoDialogOpen } from '../actions';
import uiConsts from '../assets/styles/uiConsts';

const moptions = {
  passoverHTML: false,
  passoverAttribute: 'passover',
  stripPassoverAttribute: true
};

class DisplayInfo extends React.Component {
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
    const { setDialogOpen, setThisDialogOpen } = this.props;
    setDialogOpen(true);
    setThisDialogOpen(true);
    Mousetrap.bind('esc', this.handleClose);
  }

  handleKey = () => {
    const { setDialogOpen, setThisDialogOpen } = this.props;
    setDialogOpen(true);
    setThisDialogOpen(true);
    Mousetrap.bind('esc', this.handleClose);
  }

  handleClose = () => {
    const { setDialogOpen, setThisDialogOpen } = this.props;
    setDialogOpen(false);
    setThisDialogOpen(false);
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
      // const ci = curDisplayInfo.info.cogInfo;
      // const ciKeys = Object.keys(ci);

      let descText = '';
      if (curDisplayInfo.info.desc) {
        descText = (
          <em>{curDisplayInfo.info.desc}</em>
        );
      }

      // let panelUnitText = '';
      // if (curDisplayInfo.info.panelUnitDesc) {
      //   panelUnitText = (
      //     <p>
      //       Each panel of this display represents a
      //       {curDisplayInfo.info.panelUnitDesc}
      //     </p>
      //   );
      // }
      const defaultContent = (
        <div>
          <div style={{ background: '#ededed', padding: 5 }}>
            <strong>{curDisplayInfo.info.name}</strong>
            <br />
            {descText}
          </div>
          <p>
            {`This visualization contains ${curDisplayInfo.info.n} "panels" that you can interactively view through various controls. Each panel has a set of variables or metrics, called "cognostics", that you can use to sort and filter the panels that you want to view.`}
          </p>
          <p>
            To learn more about how to interact with this visualization, click the &ldquo;?&rdquo;
            icon in the top right corner of the display.
          </p>
          {curDisplayInfo.info.has_inputs && (
            <p>
              There are user input variables available in this visualization with which you can
              provide feedback for any panel. These will show up as either a radio button or free
              text entry in the labels that show up under each panel. As you enter inputs, these
              are saved in your local web browser&apos;s storage and will be remembered in
              subsequent views of the display.
            </p>
          )}
          {curDisplayInfo.info.has_inputs && (
            <p>
              If you&apos;d like to pull the data that you have input, you can click the
              &ldquo;Export Inputs&rdquo; button at the bottom left corner of the display and
              follow the prompts in the dialog box that pops up.
            </p>
          )}
          {/* <p>
            <strong>Last updated: </strong>
            {curDisplayInfo.info.updated}
          </p> */}
          {/* <p>
            <strong>Number of panels: </strong>
            {curDisplayInfo.info.n}
          </p>
          {panelUnitText} */}
        </div>
      );

      const { isOpen } = this.props;
      dialogContent = (
        <Dialog
          open={isOpen}
          className="trelliscope-app"
          style={{ zIndex: 8000, fontWeight: 300 }}
          aria-labelledby="dialog-info-title"
          onBackdropClick={this.handleClose}
          disableEscapeKeyDown
          maxWidth="md"
        >
          <DialogTitle id="dialog-info-title">{`${curDisplayInfo.info.mdTitle}`}</DialogTitle>
          <DialogContent>
            <div className={classes.modalContainer}>
              {defaultContent}
              <div
                // we can dangerously set because the HTML is generated from marked()
                // with pure markdown (sanitize = TRUE so user HTML is not supported)
                dangerouslySetInnerHTML={{ __html: mdDesc }} // eslint-disable-line react/no-danger
              />
              {/* <h3>Cognostics</h3>
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
              </ul> */}
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
  isOpen: PropTypes.bool.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
  setThisDialogOpen: PropTypes.func.isRequired,
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
  selectedDisplaySelector, curDisplayInfoSelector, fullscreenSelector, dispInfoDialogSelector,
  (selectedDisplay, curDisplayInfo, fullscreen, isOpen) => ({
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
    active: selectedDisplay.name !== '',
    isOpen
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  setThisDialogOpen: (isOpen) => {
    dispatch(setDispInfoDialogOpen(isOpen));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(DisplayInfo));
