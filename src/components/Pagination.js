import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { setLayout } from '../actions';
import {
  nPerPageSelector, pageNumSelector, dialogOpenSelector,
  fullscreenSelector, cogDataSelector
} from '../selectors';
import { filterCardinalitySelector } from '../selectors/cogData';
import uiConsts from '../assets/styles/uiConsts';

class Pagination extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // this.state = { skip: 1 };
  // }
  componentDidMount() {
    const { fullscreen, dialogOpen } = this.props;
    if (fullscreen) {
      Mousetrap.bind('right', () => {
        if (!dialogOpen) {
          this.pageRight();
        }
      });
      Mousetrap.bind('left', () => {
        if (!dialogOpen) {
          this.pageLeft();
        }
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    const { dialogOpen } = nextProps;
    if (nextProps.fullscreen) {
      Mousetrap.bind('right', () => {
        if (!dialogOpen) {
          this.pageRight();
        }
      });
      Mousetrap.bind('left', () => {
        if (!dialogOpen) {
          this.pageLeft();
        }
      });
    } else {
      Mousetrap.unbind(['right', 'left']);
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.cogData.isLoaded && nextProps.cogData.crossfilter !== undefined;
  // }

  componentWillUnmount() {
    const { fullscreen } = this.props;
    if (fullscreen) {
      Mousetrap.unbind(['right', 'left']);
    }
  }

  pageLeft = () => {
    const { n, handleChange } = this.props;
    let nn = n - 1;
    if (nn < 1) {
      nn += 1;
    }
    return handleChange(nn);
  }

  pageRight = () => {
    const { n, totPages, handleChange } = this.props;
    let nn = n + 1;
    if (nn > totPages) {
      nn -= 1;
    }
    return handleChange(nn);
  }

  pageFirst = () => {
    const { handleChange } = this.props;
    handleChange(1);
  }

  pageLast = () => {
    const { handleChange, totPages } = this.props;
    handleChange(totPages);
  }

  render() {
    const {
      classes, cogData, totPages, totPanels, npp, n
    } = this.props;

    const styles = {
      icon: {
        fontSize: 10,
        padding: 6
      },
      button: {
        width: uiConsts.header.height - 10,
        height: uiConsts.header.height - 10,
        border: 0,
        padding: 0
      },
      progress: {
        width: 120,
        fontSize: 14,
        color: '#444',
        lineHeight: '48px'
      }
    };

    if (cogData.isFetching || (cogData.isLoaded && cogData.crossfilter === undefined)) {
      return (
        <div style={styles.progress}>loading panels...</div>
      );
    }
    if (totPanels === 0) {
      return <div />;
    }

    const pFrom = (npp * (n - 1)) + 1;
    const pTo = Math.min(npp * n, totPanels);
    let pRange = <span>{pFrom}</span>;
    if (pFrom !== pTo) {
      pRange = (
        <span>
          {pFrom}
          &nbsp;
          <span className={classes.pageDash}>-</span>
          &nbsp;
          {pTo}
        </span>
      );
    }
    const txt = (
      <span>
        {pRange}
        <span>
          {` of ${totPanels}`}
        </span>
      </span>
    );
    return (
      <div className={classes.outer}>
        <div className={classes.label}>
          {txt}
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={n <= 1}
              style={styles.button}
              // iconStyle={styles.icon}
              onClick={() => this.pageFirst()}
            >
              <FirstPageIcon />
            </IconButton>
          </div>
          <div className={classes.buttonText}>
            First
          </div>
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={n <= 1}
              style={styles.button}
              // iconStyle={styles.icon}
              onClick={() => this.pageLeft()}
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <div className={classes.buttonText}>
            Prev
          </div>
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={n >= totPages}
              style={styles.button}
              // iconStyle={styles.icon}
              onClick={() => this.pageRight()}
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
          <div className={classes.buttonText}>
            Next
          </div>
        </div>
        <div className={classes.buttonWrap}>
          <div className={classes.buttonDiv}>
            <IconButton
              disabled={n >= totPages}
              style={styles.button}
              // iconStyle={styles.icon}
              onClick={() => this.pageLast()}
            >
              <LastPageIcon />
            </IconButton>
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
  classes: PropTypes.object.isRequired,
  n: PropTypes.number.isRequired,
  npp: PropTypes.number.isRequired,
  totPages: PropTypes.number.isRequired,
  totPanels: PropTypes.number.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  cogData: PropTypes.object.isRequired
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
  pageDash: {
    display: 'inline-block',
    transform: 'scale(1.5,1)' // to deal with some browsers not being able to handle endash
  },
  label: {
    verticalAlign: 'middle',
    height: uiConsts.header.height,
    display: 'inline-block'
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  pageNumSelector, filterCardinalitySelector, nPerPageSelector,
  dialogOpenSelector, fullscreenSelector, cogDataSelector,
  (n, card, npp, dialogOpen, fullscreen, cogData) => ({
    n,
    totPanels: card,
    totPages: Math.ceil(card / npp),
    npp,
    dialogOpen,
    fullscreen,
    cogData
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
)(injectSheet(staticStyles)(Pagination));
