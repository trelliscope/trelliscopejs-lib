import React from 'react';
import PropTypes from 'prop-types';
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

FilterCatPlotBar.propTypes = {
  active: PropTypes.bool.isRequired,
  allActive: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  divStyle: PropTypes.shape({
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  d: PropTypes.shape({
    ct: PropTypes.number.isRequired,
    mct: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FilterCatPlotBar;
