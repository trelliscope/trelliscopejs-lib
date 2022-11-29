import React from 'react';
import { useSelector } from 'react-redux';
import AppsIcon from '@mui/icons-material/Apps';
import ListIcon from '@mui/icons-material/List';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import ReplayIcon from '@mui/icons-material/Replay';
import CancelIcon from '@mui/icons-material/Cancel';
import { windowHeightSelector } from '../../selectors/ui';
import styles from './HowToUse.module.scss';

const HowToUse: React.FC = () => {
  const windowHeight = useSelector(windowHeightSelector);

  return (
    <div className={styles.howToUse} style={{ maxHeight: Math.max(50, windowHeight - 310) }}>
      <div className={styles.howToUseP}>
        <strong>What: </strong>
        Trelliscope is a tool for interactively viewing a large collection of visualizations. Each visualization in a
        collection is called a&nbsp;
        <em>panel</em>
        &nbsp;and each panel typically represents one slice of a large dataset.
      </div>
      <div className={styles.howToUseP}>
        <strong>Why: </strong>
        Viewing multiple slices of a dataset simultaneously is a simple but very powerful visual technique and provides a way
        to visualize data in greater detail, particularly when the dataset is large.
      </div>
      <div className={styles.howToUseP}>
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
      <div className={styles.howToUseContentContainer}>
        <div className={styles.howToUseHi}>
          <AppsIcon />
        </div>
        <div>
          &nbsp;
          <strong>Grid: </strong>
          In the &quot;Grid&quot; sidebar, you can specify the layout of the grid of panels you wish to display, specifying
          the number of rows and columns of the grid, as well as whether to arrange panels in order by row or by column.
        </div>
      </div>
      <div className={styles.howToUseContentContainer}>
        <div className={styles.howToUseHi}>
          <ListIcon />
        </div>
        <div>
          &nbsp;
          <strong>Labels: </strong>
          In the &quot;Labels&quot; sidebar, you can specify the panel metrics that you wish to see displayed under each
          panel visualization in the grid by clicking the checkboxes. This can be useful for additional context along with
          the visualization being shown. Note that labels can also be removed by directly hovering over the label in the grid
          view and clicking the &quot;x&quot; button that appears. Labels are also automatically added when you specify a new
          variable to sort or filter on.
        </div>
      </div>
      <div className={styles.howToUseContentContainer}>
        <div className={styles.howToUseHi}>
          <FilterAltIcon />
        </div>
        <div>
          &nbsp;
          <strong>Filter: </strong>
          The &quot;Filter&quot; sidebar provides various ways to filter the panels being displayed based on the panel
          metrics. A list of variables is available as buttons. Clicking a button will produce a visual distribution of the
          variable.
          <p className={styles.howToUseP2}>
            <strong>Categorical filter: </strong>
            For categorical variables, a bar chart is provided, showing the the possible values of the variable with the size
            of the bars relating to the count of panels available under the current filtering state of all other variables. A
            bar is active if its color is highlighted. The bar chart shows active bars first followed by inactive bars.
            Clicking on a bar in this chart that is not active will cause only panels with the attribute of the clicked bar
            to be shown. Clicking on a bar that is active will remove panels with the attribute of the clicked bar from view.
            Another way to specify filtering for categorical variables is to enter text into the text field below the bar
            chart. Any matches to the typed text will be highlighted in the bar chart and panels will be filtered
            accordingly. This field can be plain text or a&nbsp;
            <a href="http://regexr.com/" target="_blank" rel="noopener noreferrer">
              regular expression
            </a>
            .
          </p>
          <p className={styles.howToUseP2}>
            <strong>Numeric filter: </strong>
            For numeric variables, a histogram is provided, which shows the distribution of the variable based on all other
            active filters. You can click and drag left to right to highlight a range of the variable for which you would
            like to filter the panels. Alternatively, you can manually enter a range in the fields provided below the
            histogram.
          </p>
          <p className={styles.howToUseP22}>
            To reset a filter variable, you can either clear out the fields, deselect the selections made in the distribution
            plots, or click the&nbsp;
            <span className={styles.howToUseInlineIcon}>
              <ReplayIcon fontSize="small" />
            </span>
            &nbsp;button located at the top right of the filter box for that variable. This icon is only available if there
            is an active filter for the variable.
          </p>
          <p className={styles.howToUseP22}>
            To close a filter box, click the&nbsp;
            <span className={styles.howToUseInlineIcon}>
              <CancelIcon fontSize="small" />
            </span>
            &nbsp;button located at the top right of the filter box. Note that if there is an active filter on the variable,
            its button in the &quot;More variables&quot; section will be green to indicate this.
          </p>
        </div>
      </div>
      <div className={styles.howToUseContentContainer}>
        <div className={styles.howToUseHi}>
          <SortIcon />
        </div>
        <div>
          <strong>Sort: </strong>
          In the &quot;Sort&quot; sidebar, a list of variables which are currently being sorted by (if any) will be listed at
          the top, followed by a list of &quot;More variables&quot; that can added to the sorting specification. Panels are
          ordered primarily according to the topmost sort variable, and any subsuequent sorting variables specify secondary,
          tertiary, etc. sorting. For an active sortig variable, clicking the blue icon with an arrow pointing up or down
          will change the order of the sorting.
        </div>
      </div>
      <div className={styles.howToUseP}>
        The active filter and sort state are displayed at the bottom of the page in the footer. Clicking the&nbsp;
        <span className={styles.howToUseInlineIcon}>
          <CancelIcon fontSize="small" />
        </span>
        &nbsp;button for anything listed in the footer will remove the sorting or filtering on that variable.
      </div>
    </div>
  );
};

export default HowToUse;
