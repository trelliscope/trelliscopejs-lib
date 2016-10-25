import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import Mousetrap from 'mousetrap';
import FlatButton from 'material-ui/FlatButton';
import { emphasize } from 'material-ui/utils/colorManipulator';
import { createSelector } from 'reselect';
import { uiConstsSelector, windowHeightSelector } from '../selectors/ui';

class HeaderLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  componentDidMount() {
    Mousetrap.bind(['a'], this.handleKey);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['a']);
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
    const actions = [
      <FlatButton
        label="Close"
        secondary
        onTouchTap={this.handleClose}
      />
    ];
    // only show keyboard shortcut for open display if there is more than one display
    let openDisplayTags = '';
    if (!this.props.singleDisplay) {
      openDisplayTags = (
        <li>
          <code style={this.props.style.dialog.code}>o</code>
          &ensp;open &quot;Select Display&quot; dialog
        </li>
      );
    }
    return (
      <button
        onClick={this.handleOpen}
        style={this.props.style.logo}
      >
        Trelliscope
        <div style={this.props.style.icon}>
          <i className="icon-help" style={this.props.style.icon} />
        </div>
        <Dialog
          title={`Trelliscope Viewer v${VERSION}`}
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <Tabs>
            <Tab label="How to Use" >
              <div style={this.props.style.dialog.div}>
                <p style={this.props.style.dialog.p}>
                  <strong>What:</strong>&nbsp;
                  Trelliscope is a tool for interactively viewing a large
                  collection of visualizations.  Each visualization in a
                  collection is called a <em>panel</em> and each panel typically
                  represents one slice of a large dataset.
                </p>
                <p style={this.props.style.dialog.p}>
                  <strong>Why:</strong>&nbsp;
                  Viewing multiple slices of a dataset simultaneously is a
                  simple  but very powerful visual technique and provides a way
                  to visualize data in greater detail, particularly when the
                  dataset is large.
                </p>
                <p style={this.props.style.dialog.p}>
                  <strong>Interactivity:</strong>&nbsp;
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
                <p style={this.props.style.dialog.p}>
                  <i className="icon-th" style={this.props.style.dialog.hi} />&nbsp;
                  <strong>Grid:</strong>&nbsp;
                  In the &quot;Grid&quot; sidebar, you can specify the layout of
                  the grid of panels you wish to display, specifying the number
                  of rows and columns of the grid, as well as whether to arrange
                  panels in order by row or by column.
                </p>
                <p style={this.props.style.dialog.p}>
                  <i className="icon-list-ul" style={this.props.style.dialog.hi} />&nbsp;
                  <strong>Labels:</strong>&nbsp;
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
                <p style={this.props.style.dialog.p}>
                  <i className="icon-filter" style={this.props.style.dialog.hi} />&nbsp;
                  <strong>Filter:</strong>&nbsp;
                  The &quot;Filter&quot; sidebar provides various ways
                  to filter the panels being displayed based on the panel
                  metrics. A list of variables is available as
                  buttons.  Clicking a button will produce a visual distribution
                  of the variable.
                  <p style={this.props.style.dialog.p2}>
                    <strong>Categorical filter:</strong>&nbsp;
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
                  <p style={this.props.style.dialog.p2}>
                    <strong>Numeric filter:</strong>&nbsp;
                    For numeric variables, a histogram is provided, which shows
                    the distribution of the variable based on all other active
                    filters. You can click
                    and drag left to right to highlight a range of the variable
                    for which you would like to filter the panels.
                    Alternatively, you can manually enter a range in the fields
                    provided below the histogram.
                  </p>
                  <p style={this.props.style.dialog.p22}>
                    To reset a filter variable, you can either clear out the
                    fields, deselect the selections made in the distribution
                    plots, or click the <i className="icon-undo" /> button
                    located at the top right of the filter box for that
                    variable.  This icon is only available if there is an active
                    filter for the variable.
                  </p>
                  <p style={this.props.style.dialog.p22}>
                    To close a filter box, click
                    the <i className="icon-times-circle" /> button located at
                    the top right of the filter box.  Note that if there is an
                    active filter on the variable, its button in the &quot;More
                    variables&quot; section will be green to indicate this.
                  </p>
                </p>
                <p style={this.props.style.dialog.p}>
                  <i className="icon-sort-amount-asc" style={this.props.style.dialog.hi} />&nbsp;
                  <strong>Sort:</strong>&nbsp;
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
            <Tab label="Keyboard Shortcuts" >
              <div style={this.props.style.dialog.div}>
                <div>
                  <div style={{ width: '50%', display: 'block', float: 'left' }}>
                    <h4 style={this.props.style.dialog.h4}>Sidebar controls</h4>
                    <ul style={this.props.style.dialog.ul}>
                      <li>
                        <code style={this.props.style.dialog.code}>g</code>
                        &ensp;open &quot;Grid&quot; sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>l</code>
                        &ensp;open &quot;Labels&quot; sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>f</code>
                        &ensp;open &quot;Filter&quot; sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>s</code>
                        &ensp;open &quot;Sort&quot; sidebar
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>esc</code>
                        &ensp;close sidebar
                      </li>
                    </ul>
                    <h4 style={this.props.style.dialog.h4}>Panel navigation</h4>
                    <ul style={this.props.style.dialog.ul}>
                      <li>
                        <code style={this.props.style.dialog.code}>left</code>
                        &ensp;page back
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>right</code>
                        &ensp;page forward
                      </li>
                    </ul>
                  </div>
                  <div style={{ width: '50%', display: 'block', float: 'left' }}>
                    <h4 style={this.props.style.dialog.h4}>Dialog boxes</h4>
                    <ul style={this.props.style.dialog.ul}>
                      {openDisplayTags}
                      <li>
                        <code style={this.props.style.dialog.code}>i</code>
                        &ensp;open &quot;Display Info&quot; dialog
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>a</code>
                        &ensp;open &quot;About&quot; dialog
                      </li>
                      <li>
                        <code style={this.props.style.dialog.code}>esc</code>
                        &ensp;close dialog
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab label="Credits" >
              <div style={this.props.style.dialog.div}>
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
  style: React.PropTypes.object,
  singleDisplay: React.PropTypes.bool,
  setDialogOpen: React.PropTypes.func
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector, windowHeightSelector,
  (ui, wh) => ({
    style: {
      logo: {
        position: 'fixed',
        top: 0,
        right: 0,
        cursor: 'pointer',
        border: 'none',
        // borderColor: ui.header.borderColor,
        height: ui.header.height,
        textAlign: 'center',
        width: ui.header.logoWidth,
        fontSize: 17,
        background: ui.header.logo.background,
        color: ui.header.logo.color
      },
      icon: {
        position: 'absolute',
        top: 1,
        right: 1,
        color: emphasize(ui.header.logo.background, 0.4)
      },
      dialog: {
        headline: {
          fontSize: 24,
          paddingTop: 16,
          marginBottom: 12,
          fontWeight: 400
        },
        div: {
          fontSize: 18,
          paddingLeft: 10,
          paddingRight: 10,
          maxHeight: Math.max(50, wh - 310),
          overflowY: 'auto'
        },
        h4: {
          marginBottom: 5
        },
        ul: {
          marginTop: 0,
          breakInside: 'avoid-column'
        },
        code: {
          color: '#FF5252',
          fontSize: 20
        },
        p: {
          textIndent: -20,
          paddingLeft: 20
        },
        p2: {
          paddingLeft: 20
        },
        p22: {
          textIndent: 0,
          paddingLeft: 20
        },
        hi: {
          color: '#FF5252'
        }
      }
    }
  })
);

const mapStateToProps = state => (
  styleSelector(state)
);

export default connect(
  mapStateToProps,
)(Radium(HeaderLogo));
