import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Mousetrap from 'mousetrap';
import { createSelector } from 'reselect';
import { fullscreenSelector } from '../../selectors';
import { windowHeightSelector } from '../../selectors/ui';
import styles from './HeaderLogo.module.scss';

interface HeaderLogoProps {
  setDialogOpen: (arg0: boolean) => void;
  fullscreen: boolean;
  windowHeight: number;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ setDialogOpen, fullscreen, windowHeight }) => {
  const [tabNumber, setTabNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
    setOpen(false);
    Mousetrap.unbind('esc');
  };

  const handleOpen = () => {
    setDialogOpen(true);
    setOpen(true);
    Mousetrap.bind('esc', handleClose);
  };

  // FIXME add typing for event once material ui is updated https://github.com/mui/material-ui/issues/17454
  const handleChange = (event: any, value: number) => {
    event.preventDefault();
    setTabNumber(value);
  };

  const handleKey = () => {
    setDialogOpen(true);
    Mousetrap.bind('esc', handleClose);
  };

  useEffect(() => {
    if (fullscreen) {
      Mousetrap.bind('a', handleKey);
    }
  }, []);

  let keyNote;
  if (!fullscreen) {
    keyNote = (
      <p className={styles.headerLogoKeynote}>Note: keyboard shortcuts are only available when the app is fullscreen.</p>
    );
  }

  const container1 = (
    <div className={styles.headerLogoDialogDiv} style={{ maxHeight: Math.max(50, windowHeight - 310) }}>
      <div className={styles.headerLogoDialogP}>
        <strong>What: </strong>
        Trelliscope is a tool for interactively viewing a large collection of visualizations. Each visualization in a
        collection is called a&nbsp;
        <em>panel</em>
        &nbsp;and each panel typically represents one slice of a large dataset.
      </div>
      <div className={styles.headerLogoDialogP}>
        <strong>Why: </strong>
        Viewing multiple slices of a dataset simultaneously is a simple but very powerful visual technique and provides a way
        to visualize data in greater detail, particularly when the dataset is large.
      </div>
      <div className={styles.headerLogoDialogP}>
        <strong>Interactivity: </strong>
        When there are many panels, it is useful to be able to navigate to which panels you want to view and make
        panel-to-panel comparisons by sorting and filtering the panels based on various criteria. Trelliscope provides this
        interactivity through panel metrics called&nbsp;
        <em>cognostics</em>.
      </div>
      <p>
        There are multiple modes of interaction with panels, indicated by the four buttons on the left sidebar of the
        application: &nbsp;
        <strong>Grid</strong>
        ,&nbsp;
        <strong>Labels</strong>
        ,&nbsp;
        <strong>Filter</strong>
        ,&nbsp;and&nbsp;
        <strong>Sort</strong>.
      </p>
      <div className={styles.headerLogoDialogP}>
        <i className={classNames('icon-th', styles.headerLogoDialogHi)} />
        &nbsp;
        <strong>Grid: </strong>
        In the &quot;Grid&quot; sidebar, you can specify the layout of the grid of panels you wish to display, specifying the
        number of rows and columns of the grid, as well as whether to arrange panels in order by row or by column.
      </div>
      <div className={styles.headerLogoDialogP}>
        <i className={classNames('icon-list-ul', styles.headerLogoDialogHi)} />
        &nbsp;
        <strong>Labels: </strong>
        In the &quot;Labels&quot; sidebar, you can specify the panel metrics that you wish to see displayed under each panel
        visualization in the grid by clicking the checkboxes. This can be useful for additional context along with the
        visualization being shown. Note that labels can also be removed by directly hovering over the label in the grid view
        and clicking the &quot;x&quot; button that appears. Labels are also automatically added when you specify a new
        variable to sort or filter on.
      </div>
      <div className={styles.headerLogoDialogP}>
        <i className={classNames('icon-filter', styles.headerLogoDialogHi)} />
        &nbsp;
        <strong>Filter: </strong>
        The &quot;Filter&quot; sidebar provides various ways to filter the panels being displayed based on the panel metrics.
        A list of variables is available as buttons. Clicking a button will produce a visual distribution of the variable.
        <p className={styles.headerLogoDialogP2}>
          <strong>Categorical filter: </strong>
          For categorical variables, a bar chart is provided, showing the the possible values of the variable with the size
          of the bars relating to the count of panels available under the current filtering state of all other variables. A
          bar is active if its color is highlighted. The bar chart shows active bars first followed by inactive bars.
          Clicking on a bar in this chart that is not active will cause only panels with the attribute of the clicked bar to
          be shown. Clicking on a bar that is active will remove panels with the attribute of the clicked bar from view.
          Another way to specify filtering for categorical variables is to enter text into the text field below the bar
          chart. Any matches to the typed text will be highlighted in the bar chart and panels will be filtered accordingly.
          This field can be plain text or a&nbsp;
          <a href="http://regexr.com/" target="_blank" rel="noopener noreferrer">
            regular expression
          </a>
          .
        </p>
        <p className={styles.headerLogoDialogP2}>
          <strong>Numeric filter: </strong>
          For numeric variables, a histogram is provided, which shows the distribution of the variable based on all other
          active filters. You can click and drag left to right to highlight a range of the variable for which you would like
          to filter the panels. Alternatively, you can manually enter a range in the fields provided below the histogram.
        </p>
        <p className={styles.headerLogoDialogP22}>
          To reset a filter variable, you can either clear out the fields, deselect the selections made in the distribution
          plots, or click the&nbsp;
          <i className="icon-undo" />
          &nbsp;button located at the top right of the filter box for that variable. This icon is only available if there is
          an active filter for the variable.
        </p>
        <p className={styles.headerLogoDialogP22}>
          To close a filter box, click the&nbsp;
          <i className="icon-times-circle" />
          &nbsp;button located at the top right of the filter box. Note that if there is an active filter on the variable,
          its button in the &quot;More variables&quot; section will be green to indicate this.
        </p>
      </div>
      <div className={styles.headerLogoDialogP}>
        <i className={classNames('icon-sort-amount-asc', styles.headerLogoDialogHi)} />
        &nbsp;
        <strong>Sort: </strong>
        In the &quot;Sort&quot; sidebar, a list of variables which are currently being sorted by (if any) will be listed at
        the top, followed by a list of &quot;More variables&quot; that can added to the sorting specification. Panels are
        ordered primarily according to the topmost sort variable, and any subsuequent sorting variables specify secondary,
        tertiary, etc. sorting. For an active sortig variable, clicking the blue icon with an arrow pointing up or down will
        change the order of the sorting.
      </div>
      <div className={styles.headerLogoDialogP}>
        The active filter and sort state are displayed at the bottom of the page in the footer. Clicking the&nbsp;
        <i className="icon-times-circle" />
        &nbsp;button for anything listed in the footer will remove the sorting or filtering on that variable.
      </div>
    </div>
  );

  const container2 = (
    <div className={styles.headerLogoDialogDiv}>
      <div>
        {keyNote}
        <div style={{ width: '50%', display: 'block', float: 'left' }}>
          <h4 className={styles.headerLogoDialogH4}>Sidebar controls</h4>
          <ul className={styles.headerLogoDialogUl}>
            <li>
              <code className={styles.headerLogoDialogCode}>g</code>
              &ensp;open &quot;Grid&quot; sidebar
            </li>
            <li>
              <code className={styles.headerLogoDialogCode}>l</code>
              &ensp;open &quot;Labels&quot; sidebar
            </li>
            <li>
              <code className={styles.headerLogoDialogCode}>f</code>
              &ensp;open &quot;Filter&quot; sidebar
            </li>
            <li>
              <code className={styles.headerLogoDialogCode}>s</code>
              &ensp;open &quot;Sort&quot; sidebar
            </li>
            <li>
              <code className={styles.headerLogoDialogCode}>esc</code>
              &ensp;close sidebar
            </li>
          </ul>
          <h4 className={styles.headerLogoDialogH4}>Panel navigation</h4>
          <ul className={styles.headerLogoDialogUl}>
            <li>
              <code className={styles.headerLogoDialogCode}>left</code>
              &ensp;page back
            </li>
            <li>
              <code className={styles.headerLogoDialogCode}>right</code>
              &ensp;page forward
            </li>
          </ul>
        </div>
        <div style={{ width: '50%', display: 'block', float: 'left' }}>
          <h4 className={styles.headerLogoDialogH4}>Dialog boxes</h4>
          <ul className={styles.headerLogoDialogUl}>
            <li>
              <code className={styles.headerLogoDialogCode}>i</code>
              &ensp;open &quot;Display Info&quot; dialog
            </li>
            <li>
              <code className={styles.headerLogoDialogCode}>a</code>
              &ensp;open &quot;About&quot; dialog
            </li>
            <li>
              <code className={styles.headerLogoDialogCode}>esc</code>
              &ensp;close dialog
            </li>
          </ul>
          <h4 className={styles.headerLogoDialogH4}>Touchscreen devices</h4>
          <p className={styles.headerLogoDialogUl}>Swiping left and right will page the panels forward and backward</p>
        </div>
      </div>
    </div>
  );

  const container3 = (
    <div className={styles.headerLogoDialogDiv}>
      <p>
        &copy;&nbsp;
        <a href="http://ryanhafen.com" target="_blank" rel="noopener noreferrer">
          Ryan Hafen
        </a>
        , 2019.
      </p>
      <p>
        Built with&nbsp;
        <a href="https://facebook.github.io/react/" target="_blank" rel="noopener noreferrer">
          React
        </a>
        &nbsp;and several other awesome libraries listed&nbsp;
        <a
          href="https://github.com/hafen/trelliscopejs-lib/blob/master/package.json"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
      <p>
        Source code available on&nbsp;
        <a href="https://github.com/hafen/trelliscopejs-lib/" target="_blank" rel="noopener noreferrer">
          github
        </a>
        &nbsp;&ndash; submit issues and feature requests there.
      </p>
      <p>
        Thanks to Bill Cleveland for ideas upon which this is built, to Saptarshi Guha for creating a multi-panel plot viewer
        prototype many years ago that inspired initial work, and to Barret Schloerke for the introduction to React and
        discussions about the interface.
      </p>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen} className={styles.headerLogo}>
        Trelliscope
        <div className={styles.headerLogoIcon}>
          <i className={classNames('icon-help', styles.headerLogoIcon)} />
        </div>
      </button>
      <Dialog
        open={open}
        className="trelliscope-app"
        style={{ zIndex: 8000, fontWeight: 300 }}
        aria-labelledby="dialog-viewer-title"
        onClose={handleClose}
      >
        <DialogTitle id="dialog-viewer-title">{`Trelliscope Viewer v${process.env.REACT_APP_VERSION}`}</DialogTitle>
        <DialogContent>
          <Tabs value={tabNumber} onChange={handleChange}>
            <Tab label="How to Use" />
            <Tab label="Shortcuts" />
            <Tab label="Credits" />
          </Tabs>
          {tabNumber === 0 && container1}
          {tabNumber === 1 && container2}
          {tabNumber === 2 && container3}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

HeaderLogo.propTypes = {
  setDialogOpen: PropTypes.func.isRequired,
  windowHeight: PropTypes.number.isRequired,
  fullscreen: PropTypes.bool.isRequired,
};

const styleSelector = createSelector(
  windowHeightSelector,
  fullscreenSelector,
  (wh, fullscreen) => ({
    windowHeight: wh,
    fullscreen,
  }),
);

const mapStateToProps = (state: {
  fullscreen: boolean;
  windowHeight: number;
}) => styleSelector(state);

export default connect(mapStateToProps)(HeaderLogo);
