import React from 'react';
import type { CSSProperties } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import type { Action, Dispatch } from 'redux';
import { sidebarActiveSelector, contentHeightSelector } from '../../selectors/ui';
import { dialogOpenSelector, fullscreenSelector, curDisplayInfoSelector } from '../../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_VIEWS } from '../../constants';
import SideButton from '../SideButton';
import styles from './SideButtons.module.scss';
import { setActiveSidebar } from '../../slices/sidebarSlice';

type Button = {
  icon: string;
  label: string;
  title: SidebarType;
  key: string;
};

const buttons: Button[] = [
  {
    icon: 'icon-th',
    label: 'Grid',
    title: SB_PANEL_LAYOUT as SidebarType,
    key: 'g',
  },
  {
    icon: 'icon-list-ul',
    label: 'Labels',
    title: SB_PANEL_LABELS as SidebarType,
    key: 'l',
  },
  {
    icon: 'icon-filter',
    label: 'Filter',
    title: SB_PANEL_FILTER as SidebarType,
    key: 'f',
  },
  {
    icon: 'icon-sort-amount-asc',
    label: 'Sort',
    title: SB_PANEL_SORT as SidebarType,
    key: 's',
  },
  {
    icon: 'icon-views',
    label: 'Views',
    title: SB_VIEWS as SidebarType,
    key: 'v',
  },
];

interface SideButtonsProps {
  fullscreen: boolean;
  active: SidebarType;
  hasViews: boolean;
  dialogOpen: boolean;
  setActive: (active: SidebarType) => void;
  inlineStyles: {
    [key: string]: CSSProperties;
  };
}

const SideButtons: React.FC<SideButtonsProps> = ({ fullscreen, active, hasViews, dialogOpen, setActive, inlineStyles }) => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'v' && !hasViews) {
      return;
    }

    if ((e?.target as Element)?.nodeName === 'INPUT' || dialogOpen) {
      e.stopPropagation();
    } else if (e.key === 'Escape' || e.key === 'Enter') {
      setActive('');
    } else {
      const which = buttons.reduce<SidebarType[]>((prev, current) => {
        if (current.key === e.key) {
          return [...prev, current.title];
        }
        return prev;
      }, []);

      if (which.length > 0) {
        setActive(which[0]);
      }
    }
  };

  useHotkeys('g, l, f, s, c, v, Enter', handleKey, { enabled: fullscreen }, [hasViews]);
  useHotkeys('esc', handleKey, { enabled: fullscreen && !!active });

  return (
    <div className={styles.sideButtonsContainer} style={inlineStyles.sideButtonsContainer}>
      <div className={styles.spacer} />
      {buttons.map((button) => {
        if (button.label === 'Views' && !hasViews) {
          return null;
        }

        return (
          <SideButton
            key={button.label}
            icon={button.icon}
            label={button.label}
            title={button.title}
            active={active === button.title}
            onClick={() => setActive(button.title)}
          />
        );
      })}
    </div>
  );
};

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector,
  sidebarActiveSelector,
  dialogOpenSelector,
  fullscreenSelector,
  curDisplayInfoSelector,
  (ch, active, dialogOpen, fullscreen, cdi) => ({
    inlineStyles: {
      sideButtonsContainer: {
        height: ch + 48,
      },
    },
    width: 48,
    active,
    dialogOpen,
    fullscreen,
    hasViews: (cdi.info && cdi.info.views && cdi.info.views.length > 0) || false,
  }),
);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setActive: (n: SidebarType) => {
    dispatch(setActiveSidebar(n));
  },
});

export default connect(stateSelector, mapDispatchToProps)(SideButtons);
