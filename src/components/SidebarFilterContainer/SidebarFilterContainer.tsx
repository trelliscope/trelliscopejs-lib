import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import styles from './SidebarFilterContainer.module.scss';

interface SidebarFilterContainerProps {
  cogInfo: { [key: string]: CogInfo };
  handleViewChange: (x: string, which: 'add' | 'remove') => void;
  handleFilterChange: (x: Filter<FilterCat | FilterRange> | string) => void;
  filterActive: boolean;
  headerExtra: string;
  displId: string;
  filterState: Filter<FilterCat | FilterRange>;
  itemContent: JSX.Element;
  d: string;
}

const SidebarFilterContainer: React.FC<SidebarFilterContainerProps> = ({
  cogInfo,
  handleViewChange,
  handleFilterChange,
  filterActive,
  headerExtra,
  displId,
  filterState,
  itemContent,
  d,
}) => (
  <div key={`${d}_${displId}`} className={styles.sidebarFilterContainer}>
    <div className={styles.sidebarFilterContainerHeader}>
      <div
        className={classNames({
          [styles.sidebarFilterContainerHeaderName]: true,
          [styles.sidebarFilterContainerHeaderNameActive]: filterActive,
        })}
      >
        <Tooltip
          title={cogInfo[d].desc}
          placement="right"
          id={`hdtooltip_${d}`}
          key={`hdtooltip_${d}`}
          arrow
          PopperProps={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -3],
                },
              },
            ],
          }}
        >
          <span data-tip data-for={`hdtooltip_${d}`}>
            <span className={styles.sidebarFilterContainerHeaderNameText}>{d}</span>
          </span>
        </Tooltip>
      </div>
      <div className={styles.sidebarFilterContainerHeaderExtra}>{headerExtra}</div>
      <button
        type="button"
        key={`${d}_${displId}-close-icon`}
        className={`${styles.sidebarFilterContainerHeaderIcon} ${styles.sidebarFilterContainerHeaderClose}`}
        onMouseDown={() => handleViewChange(d, 'remove')}
      >
        <FontAwesomeIcon icon={faWindowMinimize} />
      </button>
      <button
        type="button"
        key={`${d}_${displId}-reset-icon`}
        className={classNames({
          [styles.sidebarFilterContainerHeaderIcon]: true,
          [styles.sidebarFilterContainerHeaderReset]: true,
          [styles.sidebarFilterContainerHeaderIconHide]: !filterActive,
        })}
        onMouseDown={() => handleFilterChange(filterState.name)}
      >
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>
    </div>
    {itemContent}
  </div>
);

export default SidebarFilterContainer;
