import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Radium from 'radium';
import Mousetrap from 'mousetrap';
import IconButton from 'material-ui/IconButton';
import { uiConstsSelector } from '../selectors';
import { setLayout } from '../actions';
import { JSONFilterCardinalitySelector, nPerPageSelector, pageNumSelector }
  from '../selectors/cogInterface.js';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { skip: 1 };
  }
  componentDidMount() {
    Mousetrap.bind(['right'], () => this.pageRight());
    Mousetrap.bind(['left'], () => this.pageLeft());
  }
  componentWillUnmount() {
    Mousetrap.unbind(['right']);
    Mousetrap.unbind(['left']);
  }
  pageLeft = () => {
    let n = this.props.n - 1;
    if (n < 1) {
      n = n + 1;
    }
    return this.props.handleChange(n);
  }
  pageRight = () => {
    let n = this.props.n + 1;
    if (n > this.props.totPages) {
      n = n - 1;
    }
    return this.props.handleChange(n);
  }
  render() {
    return (
      <div style={this.props.style.outer}>
        <IconButton
          style={this.props.style.button}
          iconStyle={this.props.style.icon}
          iconClassName="icon-chevron-left"
          onClick={() => this.pageLeft()}
        />
        {this.props.n} / {this.props.totPages}
        <IconButton
          style={this.props.style.button}
          iconStyle={this.props.style.icon}
          iconClassName="icon-chevron-right"
          onClick={() => this.pageRight()}
        />
      </div>
    );
  }
}

Pagination.propTypes = {
  style: React.PropTypes.object,
  n: React.PropTypes.number,
  npp: React.PropTypes.number,
  totPages: React.PropTypes.number,
  handleChange: React.PropTypes.func
};

// ------ redux container ------

const stateSelector = createSelector(
  uiConstsSelector, pageNumSelector, JSONFilterCardinalitySelector, nPerPageSelector,
  (ui, n, card, npp) => ({
    style: {
      outer: {
        position: 'absolute',
        top: 0,
        right: ui.header.titleWidth + 50,
        display: 'inline-block',
        height: ui.header.height
      },
      button: {
        width: ui.header.height,
        height: ui.header.height,
        border: 0,
        padding: 0
      },
      icon: {
        fontSize: 16,
        lineHeight: `${ui.header.height}px`,
        padding: 0
      }
    },
    n,
    totPages: Math.ceil(card / npp),
    npp
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (n) => {
    dispatch(setLayout({ pageNum: n }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Pagination));

