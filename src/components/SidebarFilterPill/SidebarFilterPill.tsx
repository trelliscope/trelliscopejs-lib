import React from 'react';
import classNames from 'classnames';
import Tooltip from '@mui/material/Tooltip';
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
        <Tooltip
          title={cogInfo[d].desc}
          placement="right"
          id={`tooltip_${d}`}
          key={`tooltip_${d}`}
          arrow
          PopperProps={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10],
                },
              },
            ],
          }}
        >
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
        </Tooltip>
      </span>
    )}
  </React.Fragment>
);

export default SidebarFilterPill;
