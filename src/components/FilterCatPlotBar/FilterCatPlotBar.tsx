import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './FilterCatPlotBar.module.scss';

interface FilterCatPlotBarProps {
  active: boolean;
  allActive: boolean;
  width: number;
  height: number;
  divStyle: React.CSSProperties;
  d: { ct: number; mct: number; id: string };
  onClick: () => void;
}

const FilterCatPlotBar: React.FC<FilterCatPlotBarProps> = ({ onClick, d, height, width, divStyle, active, allActive }) => {
  const fontSize = Math.min(10, height - 6);
  const labelFontSize = Math.min(9, height - 7);
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
      <div className={classNames(styles.bar, { [styles.barActive]: active, [styles.barAllActive]: allActive })}>
        <div className={styles.barText} style={{ fontSize, lineHeight: `${height - 1}px`, width }}>
          <div className={styles.barTextInner}>{d.id}</div>
        </div>
      </div>
      <div className={classNames(styles.barLabel)} style={{ fontSize: labelFontSize, lineHeight: `${height - 1}px` }}>
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
  divStyle: PropTypes.object.isRequired,
  d: PropTypes.shape({
    ct: PropTypes.number.isRequired,
    mct: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FilterCatPlotBar;
