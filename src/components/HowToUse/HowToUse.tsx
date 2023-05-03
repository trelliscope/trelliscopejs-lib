import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faFilter, faSort, faGrip, faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './HowToUse.module.scss';

const HowToUse: React.FC = () => (
  <div className={styles.howToUse}>
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
      interactivity through panel meta data.
    </div>
    <p>
      There are multiple modes of interaction with panels: &nbsp;
      <strong>Layout</strong>
      ,&nbsp;
      <strong>Sort</strong>
      ,&nbsp;
      <strong>Filter</strong>
      ,&nbsp;and&nbsp;
      <strong>Labels</strong>.
    </p>
    <div className={styles.howToUseContentContainer}>
      <div className={styles.howToUseHi}>
        <FontAwesomeIcon icon={faGrip} />
      </div>
      <div>
        &nbsp;
        <strong>Layout: </strong>
        In the app controls header, you can switch between <strong>grid</strong> and <strong>table</strong> layout views. The grid view arranges the panels in a grid, and you can specify how many panels you would like to view simultaneously by increasing the number of columns. Panels will fill the available space of the screen. In table view, you can view all of your data as a table with a thumbnail of the panels as the left-most column of the table. You can drag the column header to resize the thumbnails. In either grid or table view, you can use the pagination controls or left and right keyboard arrows to flip through the panels.
      </div>
    </div>
    <div className={styles.howToUseContentContainer}>
      <div className={styles.howToUseHi}>
        <FontAwesomeIcon icon={faSort} />
      </div>
      <div>
        &nbsp;
        <strong>Sort: </strong>
        You can sort the panels by any number of variables. You can add a sorting variable by clicking the &quot;+&quot; icon in the &quot;sort&quot; section of the app controls header. You can toggle the direction of the sort (ascending or descending) by clicking on an existing sort variable. You can remove a sorting variable by clicking the &quot;x&quot; icon to the right of the sorting variable name. When in table view, you can also click column headers to set or toggle sort order. Note that factor variables are not sorted alphabetically but according to the order of their factor levels.
      </div>
    </div>
    <div className={styles.howToUseContentContainer}>
      <div className={styles.howToUseHi}>
        <FontAwesomeIcon icon={faFilter} />
      </div>
      <div>
        &nbsp;
        <strong>Filter: </strong>
        The app provides visual controls for that allow you to interactively filter the panels based on meta data variables. You can add variables to filter on by opening the filter sidebar, which can be done by clicking the &quot;Filters&quot; button in the app controls header. You can click &quot;Show/Hide Filters&quot; to select variables that you would like to filter on. A visual distribution of the varible will become available in the sidebar for you to interact with. Note that even if not filtering on a variable, it can be useful to view its distribution in relation to the panels being displayed.
        <p className={styles.howToUseP2}>
          <strong>Categorical filter: </strong>
          For categorical variables, a bar chart is provided, showing the the possible values of the variable, with the size
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
        <p className={styles.howToUseP2}>
          <strong>Numeric filter: </strong>
          For numeric variables, a histogram is provided, which shows the distribution of the variable based on all other
          active filters. You can click and drag left to right to highlight a range of the variable for which you would like
          to filter the panels. Alternatively, you can manually enter a range in the fields provided below the histogram.
        </p>
        <p className={styles.howToUseP22}>
          To reset a filter variable, you can either clear out the fields, deselect the selections made in the distribution
          plots, or click the&nbsp;
          <span className={styles.howToUseInlineIcon}>
            <FontAwesomeIcon icon={faRotateLeft} size="xs" />
          </span>
          &nbsp;button located at the top right of the filter box for that variable. This icon is only available if there is
          an active filter for the variable.
        </p>
        <p className={styles.howToUseP22}>
          To close a filter box, click the&nbsp;
          <span className={styles.howToUseInlineIcon}>
            <FontAwesomeIcon icon={faXmark} size="xs" />
          </span>
          &nbsp;button located at the top right of the filter box. Note that if there is an active filter on the variable,
          its button in the &quot;More variables&quot; section will be green to indicate this.
        </p>
      </div>
    </div>
    <div className={styles.howToUseContentContainer}>
      <div className={styles.howToUseHi}>
        <FontAwesomeIcon icon={faTags} />
      </div>
      <div>
        &nbsp;
        <strong>Labels: </strong>
        In the &quot;Labels&quot; sidebar, you can specify the panel metrics that you wish to see displayed under each panel
        visualization in the grid by clicking the checkboxes. This can be useful for additional context along with the
        visualization being shown. Note that labels can also be removed by directly hovering over the label in the grid view
        and clicking the &quot;x&quot; button that appears. Labels are also automatically added when you specify a new
        variable to sort or filter on.
      </div>
    </div>
  </div>
);

export default HowToUse;
