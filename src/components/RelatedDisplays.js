import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { uiConstsSelector } from '../selectors/ui';
import { relatedDisplaysSelector } from '../selectors/display';
import { selectedDisplaySelector } from '../selectors';

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
        style={this.props.style.button}
      >
        <i className="icon-open-add" style={{ paddingLeft: 2, lineHeight: '45px' }} />
        <Dialog
          title="Add Related Displays"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Under construction...
          {this.props.relatedDisplays.map((d, i) => (
            <div key={i}>{d.group} / {d.name}</div>
          ))}
        </Dialog>
      </div>
    );
  }
}

RelatedDisplays.propTypes = {
  style: React.PropTypes.object,
  selectedDisplay: React.PropTypes.object,
  relatedDisplays: React.PropTypes.array,
  handleClick: React.PropTypes.func,
  active: React.PropTypes.bool
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector, relatedDisplaysSelector, selectedDisplaySelector,
  (ui, rd, sd) => ({
    style: {
      button: {
        position: 'fixed',
        boxSizing: 'border-box',
        top: 0,
        transition: 'left 0.5s ease, background 250ms',
        left: ui.header.height *
          (sd.name === '' || rd.length === 0 ? 0 : 2),
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
      }
    },
    relatedDisplays: rd,
    active: rd.length > 0
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(Radium(RelatedDisplays));
