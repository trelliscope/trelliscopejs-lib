import React from 'react';
import classNames from 'classnames';
import styles from './FilterCatPlotBar.module.scss';

interface FilterCatPlotBarProps {
  active: boolean;
  allActive: boolean;
  width: number;
  height: number;
  divStyle: object;
  d: { ct: number; mct: number; id: string };
  onClick: () => void;
}

const FilterCatPlotBar: React.FC<FilterCatPlotBarProps> = ({ onClick, d, height, width, divStyle, active, allActive }) => {
  const fontSize = Math.min(10, height - 6);
  const label = d.ct === d.mct ? d.mct : `${d.ct} / ${d.mct}`;
  return (
    <div
      className={classNames(styles.wrapper)}
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex={0}
      style={divStyle}
    >
      <div
        className={classNames(styles.bar, { [styles.barActive]: active, [styles.barAllActive]: allActive })}
        style={{ width, height: height - 1 }}
      >
        <div className={styles.barText} style={{ fontSize: `${fontSize}px`, lineHeight: `${height - 1}px`, width }}>
          <div className={styles.barTextInner}>{d.id}</div>
        </div>
      </div>
      <div className={classNames(styles.barLabel)} style={{ lineHeight: `${height - 1}px` }}>
        {label}
      </div>
    </div>
  );
};

export default FilterCatPlotBar;
