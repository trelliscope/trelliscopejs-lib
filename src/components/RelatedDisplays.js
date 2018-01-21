import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
// import Dialog from 'material-ui/Dialog';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui-next/Dialog';
import Button from 'material-ui-next/Button';
import { relatedDisplaysSelector } from '../selectors/display';
import { selectedDisplaySelector } from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

class RelatedDisplays extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  componentDidMount() {
    if (this.props.active) {
      Mousetrap.bind(['r'], this.handleKey);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      Mousetrap.bind(['r'], this.handleKey);
    }
  }
  componentWillUnmount() {
    if (this.props.active) {
      Mousetrap.unbind(['r']);
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
    const { classes } = this.props;

    return (
      <button
        onTouchTap={this.handleOpen}
        className={classes.button}
        style={this.props.styles.button}
      >
        <i className="icon-open-add" style={{ paddingLeft: 2, lineHeight: '45px' }} />
        <Dialog
          open={this.state.open}
          className="trelliscope-app"
          style={{ zIndex: 8000, fontWeight: 300 }}
          aria-labelledby="dialog-reldisp-title"
        >
          <DialogTitle id="dialog-reldisp-title">{"Add Related Displays"}</DialogTitle>
          <DialogContent>
            Under construction...
            {this.props.relatedDisplays.map(d => (
              <div key={`${d.group}_${d.name}`}>{d.group} / {d.name}</div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button color="accent" onClick={this.handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </button>
    );
  }
}

RelatedDisplays.propTypes = {
  styles: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  relatedDisplays: PropTypes.array.isRequired,
  active: PropTypes.bool.isRequired
};

// ------ static styles ------

const staticStyles = {
  button: {
    position: 'absolute',
    boxSizing: 'border-box',
    top: 0,
    transition: 'left 0.5s ease, background 250ms',
    display: 'inline-block',
    height: uiConsts.header.height,
    width: uiConsts.header.height,
    fontSize: 18,
    lineHeight: `${uiConsts.header.height}px`,
    color: uiConsts.header.button.color,
    background: 'white',
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
  }
};

// ------ redux container ------

const styleSelector = createSelector(
  relatedDisplaysSelector, selectedDisplaySelector,
  (rd, sd) => ({
    styles: {
      button: {
        left: uiConsts.header.height *
          (sd.name === '' || rd.length === 0 ? 0 : 2)
      }
    },
    relatedDisplays: rd,
    active: rd.length > 0
  })
);

const mapStateToProps = state => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(injectSheet(staticStyles)(RelatedDisplays));
