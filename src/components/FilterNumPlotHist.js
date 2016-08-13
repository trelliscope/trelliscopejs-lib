import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { uiConstsSelector } from '../selectors/ui';

class NumHist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }
  render() {
    return (
      <div>histogram placeholder...</div>
    );
  }
}

NumHist.propTypes = {
  style: React.PropTypes.object,
  active: React.PropTypes.bool,
  width: React.PropTypes.number,
  totWidth: React.PropTypes.number,
  height: React.PropTypes.number,
  d: React.PropTypes.object,
  handleClick: React.PropTypes.func
};


// ------ redux container ------

const stateSelector = createSelector(
  uiConstsSelector,
  (ui) => ({
    style: {
      wrapper: {
        background: 'white'
      },
      wrapperHover: {
        background: '#f6f6f6'
      },
      bar: {
        background: ui.sidebar.filter.cat.bar.color.default,
        position: 'absolute',
        left: 0
      },
      barHover: {
        background: ui.sidebar.filter.cat.bar.color.hover
      },
      barActive: {
        background: ui.sidebar.filter.cat.bar.color.select
      },
      barLabel: {
        fontSize: 10,
        color: 'gray',
        textAlign: 'center',
        cursor: 'default',
        position: 'absolute',
        lineHeight: '19px',
        right: 4
      },
      hidden: {
        visibility: 'hidden'
      },
      barText: {
        display: 'inline-block',
        overflow: 'hidden',
        cursor: 'default'
      },
      barTextInner: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        position: 'absolute',
        left: 5,
        bottom: 0
      }
    }
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

// const mapDispatchToProps = (dispatch) => ({
//   handleViewChange: (x) => {
//     dispatch(setFilterView(x));
//   },
//   handleFilterChange: (x) => {
//     const obj = {};
//     obj[x.name] = x;
//     dispatch(setFilter(obj));
//     dispatch(setLayout({ pageNum: 1 }));
//   },
//   handleFilterSortChange: (x) => {
//     const obj = {};
//     obj[x.name] = x;
//     dispatch(setFilter(obj));
//   }
// });

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(Radium(NumHist));
