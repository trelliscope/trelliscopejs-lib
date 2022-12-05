import React from 'react';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import styles from './SidebarFilterPill.module.scss';

interface SidebarFilterPillProps {
  filter: { [key: string]: Filter<FilterCat | FilterRange> };
  cogInfo: { [key: string]: CogInfo };
  handleViewChange: (x: string, which: 'add' | 'remove') => void;
  inames: string[];
  displId: string;
  d: string;
}

const SidebarFilterPill: React.FC<SidebarFilterPillProps> = ({ filter, cogInfo, handleViewChange, inames, displId, d }) => (
  <React.Fragment key={`${d}_${displId}`}>
    {inames.includes(d) && (
      <span>
        <span data-tip data-for={`tooltip_${d}`}>
          <button
            type="button"
            className={classNames({
              [styles.sidebarFilterPillVariable]: true,
              [styles.sidebarFilterPillVariableActive]: filter[d] && filter[d].value !== undefined,
            })}
            key={`${d}_${displId}_button_${inames.length}`}
            onClick={() => handleViewChange(d, 'add')}
          >
            {d}
          </button>
        </span>
        <ReactTooltip className={styles.sidebarFilterPillTooltip} place="right" id={`tooltip_${d}`}>
          <span>{cogInfo[d].desc}</span>
        </ReactTooltip>
      </span>
    )}
  </React.Fragment>
);

export default SidebarFilterPill;
