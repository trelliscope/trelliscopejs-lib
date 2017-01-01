import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import Mousetrap from 'mousetrap';
import FlatButton from 'material-ui/FlatButton';
import { emphasize } from 'material-ui/utils/colorManipulator';
import { createSelector } from 'reselect';
import { fullscreenSelector } from '../selectors';
import { windowHeightSelector } from '../selectors/ui';
import uiConsts from '../assets/styles/uiConsts';

class HeaderLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  componentDidMount() {
    if (this.props.fullscreen) {
      Mousetrap.bind(['a'], this.handleKey);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.fullscreen) {
      Mousetrap.bind(['a'], this.handleKey);
    } else {
      Mousetrap.unbind(['a']);
    }
  }
  componentWillUnmount() {
    if (this.props.fullscreen) {
      Mousetrap.unbind(['a']);
    }
  }
  handleOpen = () => {
    this.props.setDialogOpen(true);
    this.setState({ open: true });
  }
  handleKey = () => {
    this.props.setDialogOpen(true);
    this.setState({ open: true });
  }
  handleClose = () => {
    this.props.setDialogOpen(false);
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

    let keyNote = '';
    if (!this.props.fullscreen) {
      keyNote = (
        <p className={classes.keynote}>
          Note: keyboard shortcuts are only available when the app is fullscreen.
        </p>
      );
    }
    return (
      <button
        onTouchTap={this.handleOpen}
        className={classes.logo}
      >
        Trelliscope
        <div className={classes.icon}>
          <i className={`icon-help ${classes.icon}`} />
        </div>
        <Dialog
          title={`Trelliscope Viewer v${VERSION}`}
          className="trelliscope-app"
          style={{ zIndex: 8000, fontWeight: 300 }}
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <Tabs>
            <Tab label="How to Use" >
              <div
                className={classes.dialogDiv}
                style={{ maxHeight: Math.max(50, this.props.windowHeight - 310) }}
              >
                <p className={classes.dialogP}>
                  <strong>What: </strong>
                  Trelliscope is a tool for interactively viewing a large
                  collection of visualizations.  Each visualization in a
                  collection is called a <em>panel</em> and each panel typically
                  represents one slice of a large dataset.
                </p>
                <p className={classes.dialogP}>
                  <strong>Why: </strong>
                  Viewing multiple slices of a dataset simultaneously is a
                  simple  but very powerful visual technique and provides a way
                  to visualize data in greater detail, particularly when the
                  dataset is large.
                </p>
                <p className={classes.dialogP}>
                  <strong>Interactivity: </strong>
                  When there are many panels, it is useful to be able to
                  navigate to which panels you want to view and make
                  panel-to-panel comparisons by
                  sorting and filtering the panels based on various criteria.
                  Trelliscope provides this interactivity through panel metrics
                  called <em>cognostics</em>.
                </p>
                <p>
                  There are multiple modes of interaction with panels, indicated
                  by the four buttons on the left sidebar of the application:
                  &nbsp;
                  <strong>Grid</strong>, <strong>Labels</strong>,&nbsp;
                  <strong>Filter</strong>, and <strong>Sort</strong>.
                </p>
                <p className={classes.dialogP}>
                  <i className={`icon-th ${classes.dialogHi}`} />&nbsp;
                  <strong>Grid: </strong>
                  In the &quot;Grid&quot; sidebar, you can specify the layout of
                  the grid of panels you wish to display, specifying the number
                  of rows and columns of the grid, as well as whether to arrange
                  panels in order by row or by column.
                </p>
                <p className={classes.dialogP}>
                  <i className={`icon-list-ul ${classes.dialogHi}`} />&nbsp;
                  <strong>Labels: </strong>
                  In the &quot;Labels&quot; sidebar, you can specify the panel
                  metrics that you wish to see displayed under each panel
                  visualization in the grid by clicking the checkboxes.  This
                  can be useful for additional context along with the
                  visualization being shown.  Note that
                  labels can also be removed by directly hovering over the label
                  in the grid view and clicking the &quot;x&quot; button that
                  appears.  Labels are also automatically added when you specify
                  a new variable to sort or filter on.
                </p>
                <p className={classes.dialogP}>
                  <i className={`icon-filter ${classes.dialogHi}`} />&nbsp;
                  <strong>Filter: </strong>
                  The &quot;Filter&quot; sidebar provides various ways
                  to filter the panels being displayed based on the panel
                  metrics. A list of variables is available as
                  buttons.  Clicking a button will produce a visual distribution
                  of the variable.
                  <p className={classes.dialogP2}>
                    <strong>Categorical filter: </strong>
                    For categorical variables, a bar chart is provided,
                    showing the the possible values of the variable
                    with the size of the bars relating to the count of panels
                    available under the current filtering state of all other
                    variables. A bar is active if its color is highlighted.  The
                    bar chart shows active bars first followed by inactive bars.
                    Clicking on a bar in this chart that is not
                    active will cause only
                    panels with the attribute of the clicked bar to be shown.
                    Clicking on a bar that is active will remove panels with
                    the attribute of the clicked bar from view.  Another way to
                    specify filtering for categorical variables is to enter text
                    into the text field below the bar chart.  Any matches to the
                    typed text will be highlighted in the bar chart and panels
                    will be filtered accordingly.  This field can be plain text or
                    a <a href="http://regexr.com/" target="_blank" rel="noopener noreferrer">regular expression</a>.
                  </p>
                  <p className={classes.dialogP2}>
                    <strong>Numeric filter: </strong>
                    For numeric variables, a histogram is provided, which shows
                    the distribution of the variable based on all other active
                    filters. You can click
                    and drag left to right to highlight a range of the variable
                    for which you would like to filter the panels.
                    Alternatively, you can manually enter a range in the fields
                    provided below the histogram.
                  </p>
                  <p className={classes.dialogP22}>
                    To reset a filter variable, you can either clear out the
                    fields, deselect the selections made in the distribution
                    plots, or click the <i className="icon-undo" /> button
                    located at the top right of the filter box for that
                    variable.  This icon is only available if there is an active
                    filter for the variable.
                  </p>
                  <p className={classes.dialogP22}>
                    To close a filter box, click
                    the <i className="icon-times-circle" /> button located at
                    the top right of the filter box.  Note that if there is an
                    active filter on the variable, its button in the &quot;More
                    variables&quot; section will be green to indicate this.
                  </p>
                </p>
                <p className={classes.dialogP}>
                  <i className={`icon-sort-amount-asc ${classes.dialogHi}`} />&nbsp;
                  <strong>Sort: </strong>
                  In the &quot;Sort&quot; sidebar, a list of variables which are
                  currently being sorted by (if any) will be listed at the top,
                  followed by a list of &quot;More variables&quot; that can
                  added to the sorting specification.  Panels are
                  ordered primarily according to the topmost sort variable, and
                  any subsuequent sorting variables specify secondary, tertiary,
                  etc. sorting.
                  For an active sortig variable, clicking the blue icon
                  with an arrow pointing up or down will change the order of the
                  sorting.
                </p>
                <p>
                  The active filter and sort state are displayed at the bottom
                  of the page in the footer.  Clicking
                  the <i className="icon-times-circle" /> button
                  for anything listed in the footer will remove the sorting or
                  filtering on that variable.
                </p>
              </div>
            </Tab>
            <Tab label="Shortcuts" >
              <div className={classes.dialogDiv}>
                <div>
                  {keyNote}
                  <div style={{ width: '50%', display: 'block', float: 'left' }}>
                    <h4 className={classes.dialogH4}>Sidebar controls</h4>
                    <ul className={classes.dialogUl}>
                      <li>
                        <code className={classes.dialogCode}>g</code>
                        &ensp;open &quot;Grid&quot; sidebar
                      </li>
                      <li>
                        <code className={classes.dialogCode}>l</code>
                        &ensp;open &quot;Labels&quot; sidebar
                      </li>
                      <li>
                        <code className={classes.dialogCode}>f</code>
                        &ensp;open &quot;Filter&quot; sidebar
                      </li>
                      <li>
                        <code className={classes.dialogCode}>s</code>
                        &ensp;open &quot;Sort&quot; sidebar
                      </li>
                      <li>
                        <code className={classes.dialogCode}>esc</code>
                        &ensp;close sidebar
                      </li>
                    </ul>
                    <h4 className={classes.dialogH4}>Panel navigation</h4>
                    <ul className={classes.dialogUl}>
                      <li>
                        <code className={classes.dialogCode}>left</code>
                        &ensp;page back
                      </li>
                      <li>
                        <code className={classes.dialogCode}>right</code>
                        &ensp;page forward
                      </li>
                    </ul>
                  </div>
                  <div style={{ width: '50%', display: 'block', float: 'left' }}>
                    <h4 className={classes.dialogH4}>Dialog boxes</h4>
                    <ul className={classes.dialogUl}>
                      <li>
                        <code className={classes.dialogCode}>i</code>
                        &ensp;open &quot;Display Info&quot; dialog
                      </li>
                      <li>
                        <code className={classes.dialogCode}>a</code>
                        &ensp;open &quot;About&quot; dialog
                      </li>
                      <li>
                        <code className={classes.dialogCode}>esc</code>
                        &ensp;close dialog
                      </li>
                    </ul>
                    <h4 className={classes.dialogH4}>Touchscreen devices</h4>
                    <p className={classes.dialogUl}>
                      Swiping left and right will page the panels forward and backward
                    </p>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab label="Credits" >
              <div className={classes.dialogDiv}>
                <p>
                  &copy;&nbsp;
                  <a
                    href="http://ryanhafen.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ryan Hafen
                  </a>, 2016.
                </p>
                <p>
                  Built with&nbsp;
                  <a
                    href="https://facebook.github.io/react/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    React
                  </a>
                  &nbsp;and several other awesome libraries listed&nbsp;
                  <a
                    href="https://github.com/hafen/TrelliscopeJS/blob/master/package.json"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>.
                </p>
                <p>
                  Source code available on <a href="https://github.com/hafen/TrelliscopeJS/" target="_blank" rel="noopener noreferrer">github</a> &ndash; submit issues and feature requests there.
                </p>
                <p>
                  Thanks to Bill Cleveland for ideas upon which this is built,
                  to Saptarshi Guha for creating a multi-panel plot viewer prototype
                  many years ago that inspired initial work,
                  and to Barret Schloerke for the introduction to React
                  and discussions about the interface.
                </p>
              </div>
            </Tab>
          </Tabs>
        </Dialog>
      </button>
    );
  }
}

HeaderLogo.propTypes = {
  sheet: React.PropTypes.object,
  windowHeight: React.PropTypes.number,
  fullscreen: React.PropTypes.bool,
  setDialogOpen: React.PropTypes.func
};

// ------ static styles ------

const staticStyles = {
  logo: {
    position: 'absolute',
    top: -1, // cover up top app border
    right: 0,
    cursor: 'pointer',
    border: 'none',
    // borderColor: uiConsts.header.borderColor,
    height: uiConsts.header.height,
    textAlign: 'center',
    width: uiConsts.header.logoWidth,
    fontSize: 17,
    background: uiConsts.header.logo.background,
    color: uiConsts.header.logo.color
  },
  icon: {
    position: 'absolute',
    top: 1,
    right: 1,
    color: emphasize(uiConsts.header.logo.background, 0.4)
  },
  dialogHeadline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  },
  dialogDiv: {
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10,
    overflowY: 'auto'
  },
  dialogH4: {
    marginBottom: 5
  },
  dialogUl: {
    marginTop: 0,
    breakInside: 'avoid-column'
  },
  dialogCode: {
    color: '#FF5252',
    fontSize: 20
  },
  dialogP: {
    textIndent: -20,
    paddingLeft: 20
  },
  dialogP2: {
    paddingLeft: 20
  },
  dialogP22: {
    textIndent: 0,
    paddingLeft: 20
  },
  dialogHi: {
    color: '#FF5252'
  },
  keynote: {
    marginBottom: 0,
    color: '#888',
    fontStyle: 'italic'
  }
};

// ------ redux container ------

const styleSelector = createSelector(
  windowHeightSelector, fullscreenSelector,
  (wh, fullscreen) => ({
    windowHeight: wh,
    fullscreen
  })
);

const mapStateToProps = state => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(injectSheet(staticStyles)(HeaderLogo));
