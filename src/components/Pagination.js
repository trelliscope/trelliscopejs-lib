import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Radium from 'radium';
import Mousetrap from 'Mousetrap';
import { uiConstsSelector } from '../selectors';
import { setPageNum } from '../actions';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { skip: 1 };
  }
  componentDidMount() {
    Mousetrap.bind(['right'], () => {
      let n = this.props.n + 1;
      if (n > 9) {
        n = n - 1;
      }
      return this.props.handleChange(n);
    });
    Mousetrap.bind(['left'], () => {
      let n = this.props.n - 1;
      if (n < 1) {
        n = n + 1;
      }
      return this.props.handleChange(n);
    });
  }
  componentWillUnmount() {
    Mousetrap.unbind(['right']);
    Mousetrap.unbind(['left']);
  }
  render() {
    return (
      <div style={this.props.style}>
      {this.props.n}
      </div>
    );
  }
}

Pagination.propTypes = {
  style: React.PropTypes.object,
  n: React.PropTypes.number,
  handleChange: React.PropTypes.func
};

// ------ redux container ------

const pageNumSelector = state => state.pageNum;

const stateSelector = createSelector(
  uiConstsSelector, pageNumSelector,
  (ui, n) => ({
    style: {
      position: 'absolute',
      top: 0,
      right: ui.header.titleWidth + 50,
      display: 'inline-block',
      height: ui.header.height
    },
    n
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleChange: (n) => {
    dispatch(setPageNum(n));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Pagination));

