import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Radium from 'radium';
import Mousetrap from 'mousetrap';
import IconButton from 'material-ui/IconButton';
import { setLayout } from '../actions';
import { nPerPageSelector, pageNumSelector, dialogOpenSelector } from '../selectors';
import { uiConstsSelector } from '../selectors/ui';
import { filterCardinalitySelector } from '../selectors/cogData';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { skip: 1 };
  }
  componentDidMount() {
    Mousetrap.bind(['right'], () => {
      if (!this.props.dialogOpen) {
        this.pageRight();
      }
    });
    Mousetrap.bind(['left'], () => {
      if (!this.props.dialogOpen) {
        this.pageLeft();
      }
    });
  }
  componentWillUnmount() {
    Mousetrap.unbind(['right']);
    Mousetrap.unbind(['left']);
  }
  pageLeft = () => {
    let n = this.props.n - 1;
    if (n < 1) {
      n += 1;
    }
    return this.props.handleChange(n);
  }
  pageRight = () => {
    let n = this.props.n + 1;
    if (n > this.props.totPages) {
      n -= 1;
    }
    return this.props.handleChange(n);
  }
  pageFirst = () => this.props.handleChange(1)
  pageLast = () => this.props.handleChange(this.props.totPages)
  render() {
    const pFrom = (this.props.npp * (this.props.n - 1)) + 1;
    const pTo = Math.min(this.props.npp * this.props.n, this.props.totPanels);
    const pRange = pFrom === pTo ? pFrom : `${pFrom} \u2013 ${pTo}`;
    const txt = `${pRange} of ${this.props.totPanels}`;
    return (
      <div style={this.props.style.outer}>
        <div style={this.props.style.label}>
          {txt}
        </div>
        <div style={this.props.style.buttonWrap}>
          <div style={this.props.style.buttonDiv}>
            <IconButton
              disabled={this.props.n <= 1}
              style={this.props.style.button}
              iconStyle={this.props.style.icon}
              iconClassName="icon-angle-left"
              onClick={() => this.pageLeft()}
            />
          </div>
          <div style={this.props.style.buttonText}>
            Prev
          </div>
        </div>
        <div style={this.props.style.buttonWrap}>
          <div style={this.props.style.buttonDiv}>
            <IconButton
              disabled={this.props.n >= this.props.totPages}
              style={this.props.style.button}
              iconStyle={this.props.style.icon}
              iconClassName="icon-angle-right"
              onClick={() => this.pageRight()}
            />
          </div>
          <div style={this.props.style.buttonText}>
            Next
          </div>
        </div>
        <div style={this.props.style.buttonWrap}>
          <div style={this.props.style.buttonDiv}>
            <IconButton
              disabled={this.props.n <= 1}
              style={this.props.style.button}
              iconStyle={this.props.style.icon}
              iconClassName="icon-angle-double-left"
              onClick={() => this.pageFirst()}
            />
          </div>
          <div style={this.props.style.buttonText}>
            First
          </div>
        </div>
        <div style={this.props.style.buttonWrap}>
          <div style={this.props.style.buttonDiv}>
            <IconButton
              disabled={this.props.n >= this.props.totPages}
              style={this.props.style.button}
              iconStyle={this.props.style.icon}
              iconClassName="icon-angle-double-right"
              onClick={() => this.pageLast()}
            />
          </div>
          <div style={this.props.style.buttonText}>
            Last
          </div>
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  style: React.PropTypes.object,
  n: React.PropTypes.number,
  npp: React.PropTypes.number,
  totPages: React.PropTypes.number,
  totPanels: React.PropTypes.number,
  dialogOpen: React.PropTypes.bool,
  handleChange: React.PropTypes.func
};

// ------ redux container ------

const stateSelector = createSelector(
  uiConstsSelector, pageNumSelector, filterCardinalitySelector,
  nPerPageSelector, dialogOpenSelector,
  (ui, n, card, npp, dialogOpen) => ({
    style: {
      outer: {
        whiteSpace: 'nowrap'
      },
      buttonWrap: {
        width: ui.header.height - 10,
        height: ui.header.height,
        display: 'inline-block'
      },
      buttonDiv: {
        width: ui.header.height - 10,
        height: ui.header.height - 10,
        paddingLeft: 5
      },
      button: {
        width: ui.header.height - 10,
        height: ui.header.height - 10,
        border: 0,
        padding: 0
      },
      buttonText: {
        fontSize: 10,
        width: 48,
        height: 10,
        lineHeight: '10px',
        textAlign: 'center',
        marginTop: -5
      },
      icon: {
        fontSize: 20,
        padding: 6
      },
      label: {
        verticalAlign: 'middle',
        height: ui.header.height,
        display: 'inline-block'
      }
    },
    n,
    totPanels: card,
    totPages: Math.ceil(card / npp),
    npp,
    dialogOpen
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

const mapDispatchToProps = dispatch => ({
  handleChange: (n) => {
    dispatch(setLayout({ pageNum: n }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Pagination));

