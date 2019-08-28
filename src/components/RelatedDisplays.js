import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Rnd } from 'react-rnd';
import DisplayList from './DisplayList';
import { relatedDisplayGroupsSelector, selectedRelDispsSelector } from '../selectors/display';
import { contentHeightSelector, contentWidthSelector } from '../selectors/ui';
import { selectedDisplaySelector, displayListSelector } from '../selectors';
import { setRelDispPositions } from '../actions';
import uiConsts from '../assets/styles/uiConsts';

const boxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: 'rgba(69, 138, 249, 0.4)'
};

const previewHeight = 400;

const fixCSS = (value) => parseInt(value.replace('px', ''), 10);

class RelatedDisplays extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, activeStep: 0 };
  }

  componentDidMount() {
    const { active } = this.props;
    if (active) {
      Mousetrap.bind('r', this.handleKey);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    if (nextProps.active) {
      Mousetrap.bind('r', this.handleKey);
    } else {
      Mousetrap.unbind('r');
    }
  }

  componentWillUnmount() {
    const { active } = this.props;
    if (active) {
      Mousetrap.unbind('r');
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

  setStep = (step) => {
    this.setState({ activeStep: step });
  }

  handleNext = () => {
    this.setState({ activeStep: 1 });
  }

  handleBack = () => {
    this.setState({ activeStep: 0 });
  }

  render() {
    const {
      classes, styles, relatedDisplayGroups, displayList,
      contentHeight, contentWidth, selectedRelDisps, relDispPositions,
      handleResize
    } = this.props;
    const { open, activeStep } = this.state;

    const parentBoundary = {
      position: 'relative',
      background: '#efefef',
      width: previewHeight * (contentWidth / contentHeight),
      height: previewHeight,
      marginLeft: 'auto',
      marginRight: 'auto'
    };

    const stepContent = [
      (
        <DisplayList
          di={displayList.list}
          displayGroups={relatedDisplayGroups}
          handleClick={() => {}}
          selectable
        />
      ),
      (
        <div style={parentBoundary}>
          {
            relDispPositions.map((d) => (
              <Rnd
                key={d.name}
                style={boxStyle}
                default={{
                  width: previewHeight * d.width,
                  height: previewHeight * d.height,
                  x: previewHeight * d.left,
                  y: previewHeight * d.top
                }}
                bounds="parent"
                lockAspectRatio
                onDragStop={(e, a) => {
                  handleResize(d, relDispPositions, a.x, a.y, undefined, undefined,
                    previewHeight);
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  handleResize(d, relDispPositions, position.x, position.y,
                    fixCSS(ref.style.width), fixCSS(ref.style.height), previewHeight);
                }}
              >
                <div className={classes.trHandle} />
                <div className={classes.tlHandle} />
                <div className={classes.brHandle} />
                <div className={classes.blHandle} />
                {d.name}
              </Rnd>
            ))
          }
        </div>
      )
    ];

    return (
      <div>
        <button
          type="button"
          onClick={this.handleOpen}
          className={classes.button}
          style={styles.button}
        >
          <i className="icon-open-add" style={{ paddingLeft: 2, lineHeight: '45px' }}>
            <Badge
              className={classes.badge}
              classes={{ badge: classes.badgeCircle }}
              badgeContent={selectedRelDisps.length}
            />
          </i>
        </button>
        <Dialog
          open={open}
          className="trelliscope-app"
          style={{ zIndex: 8000, fontWeight: 300 }}
          onBackdropClick={this.handleClose}
          aria-labelledby="dialog-reldisp-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="dialog-reldisp-title">View Related Displays Simultaneously</DialogTitle>
          <DialogContent>
            <div>
              <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                <Step>
                  <StepButton
                    onClick={() => this.setStep(0)}
                  >
                    {`Select related displays (${selectedRelDisps.length} selected)`}
                  </StepButton>
                </Step>
                <Step>
                  <StepButton
                    onClick={() => this.setStep(1)}
                    disabled={activeStep === 0 && selectedRelDisps.length === 0}
                  >
                    Arrange Panel Layout
                  </StepButton>
                </Step>
              </Stepper>
              <div>
                {stepContent[activeStep]}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <Button
                // variant="outlined"
                style={{ width: 200 }}
                onClick={() => this.setStep(activeStep === 1 ? 0 : 1)}
                className={classes.button}
                disabled={activeStep === 0 && selectedRelDisps.length === 0}
              >
                { activeStep === 0 ? '' : <ChevronLeftIcon /> }
                { activeStep === 0 ? 'Set Layout' : 'Select Displays' }
                { activeStep === 0 ? <ChevronRightIcon /> : '' }
              </Button>
            </div>
            <Button color="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RelatedDisplays.propTypes = {
  styles: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  displayList: PropTypes.object.isRequired,
  relatedDisplayGroups: PropTypes.object.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  selectedRelDisps: PropTypes.array.isRequired,
  contentHeight: PropTypes.number.isRequired,
  contentWidth: PropTypes.number.isRequired,
  relDispPositions: PropTypes.array.isRequired,
  handleResize: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  button: {
    position: 'absolute',
    boxSizing: 'border-box',
    top: -1,
    transition: 'left 0.5s ease, background 250ms',
    display: 'inline-block',
    height: uiConsts.header.height,
    width: uiConsts.header.height,
    fontSize: 18,
    // lineHeight: `${uiConsts.header.height}px`,
    // color: uiConsts.header.button.color,
    // background: 'none',
    textAlign: 'center',
    borderRight: `1px solid ${uiConsts.header.borderColor}`,
    borderBottom: `1px solid ${uiConsts.header.borderColor}`,
    borderLeft: 'none',
    borderTop: 'none',
    '&:hover': {
      transition: 'background 250ms',
      background: '#eee',
      cursor: 'pointer'
    }
  },
  trHandle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    background: 'rgba(69, 138, 249, 0.4)'
  },
  tlHandle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 8,
    height: 8,
    background: 'rgba(69, 138, 249, 0.4)'
  },
  brHandle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    background: 'rgba(69, 138, 249, 0.4)'
  },
  blHandle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 8,
    height: 8,
    background: 'rgba(69, 138, 249, 0.4)'
  },
  badge: {
    paddingBottom: 27
  },
  badgeCircle: {
    background: 'rgba(69, 138, 249, 0.4)',
    color: 'white'
  }
};

// ------ redux container ------

const relDispPositionsSelector = (state) => state.relDispPositions;

const styleSelector = createSelector(
  displayListSelector, selectedDisplaySelector, relatedDisplayGroupsSelector,
  contentHeightSelector, contentWidthSelector, selectedRelDispsSelector,
  relDispPositionsSelector,
  (dl, sd, rdg, ch, cw, srd, rdp) => ({
    styles: {
      button: {
        left: uiConsts.header.height * (sd.name === '' || Object.keys(rdg).length === 0 ? 0 : 2) - 1,
        background: srd.length === 0 ? 'none' : 'rgba(69, 138, 249, 0.4)',
        color: srd.length === 0 ? uiConsts.header.button.color : 'white'
      }
    },
    displayList: dl,
    relatedDisplayGroups: rdg,
    active: Object.keys(rdg).length > 0,
    contentHeight: ch,
    contentWidth: cw,
    selectedRelDisps: srd,
    relDispPositions: rdp
  })
);

const mapDispatchToProps = (dispatch) => ({
  handleResize: (pos, relDispPositions, x, y, width, height, prvwHeight) => {
    const names = relDispPositions.map((d) => d.name);
    const idx = names.indexOf(pos.name);
    const newPos = { ...pos };
    newPos.left = x / prvwHeight;
    newPos.top = y / prvwHeight;

    if (width) {
      newPos.width = width / prvwHeight;
    }
    if (height) {
      newPos.height = height / prvwHeight;
    }
    const newPositions = { ...relDispPositions };
    newPositions[idx] = newPos;
    dispatch(setRelDispPositions(newPositions));
  }
});

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(RelatedDisplays));
