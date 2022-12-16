import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarActiveSelector, contentHeightSelector } from '../../selectors/ui';
import { dialogOpenSelector, fullscreenSelector, curDisplayInfoSelector } from '../../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_VIEWS } from '../../constants';
import SideButton from '../SideButton';
import { setActiveSidebar } from '../../slices/sidebarSlice';
import getCustomProperties from '../../getCustomProperties';
import styles from './SideButtons.module.scss';

type Button = {
  label: string;
  title: SidebarType;
  key: string;
};

const buttons: Button[] = [
  {
    label: 'Grid',
    title: SB_PANEL_LAYOUT as SidebarType,
    key: 'g',
  },
  {
    label: 'Labels',
    title: SB_PANEL_LABELS as SidebarType,
    key: 'l',
  },
  {
    label: 'Filter',
    title: SB_PANEL_FILTER as SidebarType,
    key: 'f',
  },
  {
    label: 'Sort',
    title: SB_PANEL_SORT as SidebarType,
    key: 's',
  },
  {
    label: 'Views',
    title: SB_VIEWS as SidebarType,
    key: 'v',
  },
];

const SideButtons: React.FC = () => {
  const dispatch = useDispatch();
  const [headerHeight] = getCustomProperties(['--header-height']) as number[];
  const ch = useSelector(contentHeightSelector);
  const active = useSelector(sidebarActiveSelector);
  const dialogOpen = useSelector(dialogOpenSelector);
  const fullscreen = useSelector(fullscreenSelector);
  const cdi = useSelector(curDisplayInfoSelector);
  const hasViews = (cdi.info && cdi.info.views && cdi.info.views.length > 0) || false;

  const inlineStyles = {
    sideButtonsContainer: {
      height: ch + headerHeight,
    },
  };

  const handleSetActive = (n: SidebarType) => {
    dispatch(setActiveSidebar(n));
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'v' && !hasViews) {
      return;
    }

    if ((e?.target as Element)?.nodeName === 'INPUT' || dialogOpen) {
      e.stopPropagation();
    } else if (e.key === 'Escape' || e.key === 'Enter') {
      handleSetActive('');
    } else {
      const which = buttons.reduce<SidebarType[]>((prev, current) => {
        if (current.key === e.key) {
          return [...prev, current.title];
        }
        return prev;
      }, []);

      if (which.length > 0) {
        handleSetActive(which[0]);
      }
    }
  };

  useHotkeys('g, l, f, s, c, v, Enter', handleKey, { enabled: fullscreen }, [hasViews]);
  useHotkeys('esc', handleKey, { enabled: fullscreen && !!active && !dialogOpen });

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
            label={button.label}
            title={button.title}
            active={active === button.title}
            onClick={() => handleSetActive(button.title)}
          />
        );
      })}
    </div>
  );
};

export default SideButtons;
