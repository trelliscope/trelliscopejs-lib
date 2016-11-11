import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import IconButton from 'material-ui/IconButton';
import { setLayout } from '../actions';
import { nPerPageSelector, pageNumSelector, dialogOpenSelector,
  fullscreenSelector } from '../selectors';
import { filterCardinalitySelector } from '../selectors/cogData';
import uiConsts from '../assets/styles/uiConsts';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { skip: 1 };
  }
  componentDidMount() {
    if (this.props.fullscreen) {
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
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.fullscreen) {
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
    } else {
      Mousetrap.unbind(['right']);
      Mousetrap.unbind(['left']);
    }
  }
  componentWillUnmount() {
    if (this.props.fullscreen) {
      Mousetrap.unbind(['right']);
      Mousetrap.unbind(['left']);
    }
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
    const { classes } = this.props.sheet;

    const iconStyle = {
      fontSize: 20,
      padding: 6
    };
    const buttonStyle = {
      width: uiConsts.header.height - 10,
      height: uiConsts.header.height - 10,
      border: 0,
      padding: 0
    };

    const pFrom = (this.props.npp * (this.props.n - 1)) + 1;
    const pTo = Math.min(this.props.npp * this.props.n, this.props.totPanels);
    const pRange = pFrom === pTo ? pFrom : `${pFrom} \u2013 ${pTo}`;
    const txt = `${pRange} of ${this.props.totPanels}`;
    return (
      <div className={classes.outer}>
        <div className={classes.label}>
          {txt}
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={this.props.n <= 1}
              style={buttonStyle}
              iconStyle={iconStyle}
              iconClassName="icon-angle-left"
              onTouchTap={() => this.pageLeft()}
            />
          </div>
          <div className={classes.buttonText}>
            Prev
          </div>
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={this.props.n >= this.props.totPages}
              style={buttonStyle}
              iconStyle={iconStyle}
              iconClassName="icon-angle-right"
              onTouchTap={() => this.pageRight()}
            />
          </div>
          <div className={classes.buttonText}>
            Next
          </div>
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={this.props.n <= 1}
              style={buttonStyle}
              iconStyle={iconStyle}
              iconClassName="icon-angle-double-left"
              onTouchTap={() => this.pageFirst()}
            />
          </div>
          <div className={classes.buttonText}>
            First
          </div>
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={this.props.n >= this.props.totPages}
              style={buttonStyle}
              iconStyle={iconStyle}
              iconClassName="icon-angle-double-right"
              onTouchTap={() => this.pageLast()}
            />
          </div>
          <div className={classes.buttonText}>
            Last
          </div>
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  sheet: React.PropTypes.object,
  n: React.PropTypes.number,
  npp: React.PropTypes.number,
  totPages: React.PropTypes.number,
  totPanels: React.PropTypes.number,
  dialogOpen: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool,
  handleChange: React.PropTypes.func
};

// ------ static styles ------

const staticStyles = {
  outer: {
    whiteSpace: 'nowrap'
  },
  buttonWrap: {
    width: uiConsts.header.height - 10,
    height: uiConsts.header.height,
    display: 'inline-block'
  },
  buttonDiv: {
    width: uiConsts.header.height - 10,
    height: uiConsts.header.height - 10,
    paddingLeft: 5
  },
  buttonText: {
    fontSize: 10,
    width: 48,
    height: 10,
    lineHeight: '10px',
    textAlign: 'center',
    marginTop: -5
  },
  label: {
    verticalAlign: 'middle',
    height: uiConsts.header.height,
    display: 'inline-block'
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  pageNumSelector, filterCardinalitySelector,
  nPerPageSelector, dialogOpenSelector, fullscreenSelector,
  (n, card, npp, dialogOpen, fullscreen) => ({
    n,
    totPanels: card,
    totPages: Math.ceil(card / npp),
    npp,
    dialogOpen,
    fullscreen
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
)(injectSheet(staticStyles)(Pagination));
