import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { relatedDisplaysSelector } from '../selectors/display';
import { selectedDisplaySelector } from '../selectors';
import uiConsts from '../styles/uiConsts';

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
    const { classes } = this.props.sheet;

    const actions = [
      <FlatButton
        label="Close"
        secondary
        onTouchTap={this.handleClose}
      />
    ];
    return (
      <button
        onTouchTap={this.handleOpen}
        className={classes.button}
        style={this.props.styles.button}
      >
        <i className="icon-open-add" style={{ paddingLeft: 2, lineHeight: '45px' }} />
        <Dialog
          title="Add Related Displays"
          actions={actions}
          modal={false}
          style={{ zIndex: 8000, fontWeight: 300 }}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Under construction...
          {this.props.relatedDisplays.map((d, i) => (
            <div key={i}>{d.group} / {d.name}</div>
          ))}
        </Dialog>
      </button>
    );
  }
}

RelatedDisplays.propTypes = {
  styles: React.PropTypes.object,
  sheet: React.PropTypes.object,
  relatedDisplays: React.PropTypes.array,
  active: React.PropTypes.bool
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
