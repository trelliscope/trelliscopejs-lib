import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Action } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import DisplayInfo from '../DisplayInfo';
import RelatedDisplays from '../RelatedDisplays';
import DisplaySelect from '../DisplaySelect';
import Pagination from '../Pagination';
import HeaderLogo from '../HeaderLogo';
import type { RootState } from '../../store';
import { fetchDisplay, setDialogOpen } from '../../actions';
import { windowWidthSelector } from '../../selectors/ui';
import { relatedDisplayGroupsSelector, displayGroupsSelector } from '../../selectors/display';
import {
  appIdSelector,
  configSelector,
  displayListSelector,
  selectedDisplaySelector,
  dialogOpenSelector,
} from '../../selectors';
import uiConsts from '../../assets/styles/uiConsts';
import { SelectedDisplayState, setSelectedDisplay } from '../../slices/selectedDisplaySlice';
import styles from './Header.module.scss';

interface HeaderProps {
  cfg: Config;
  appId: string;
  displayList: DisplayList;
  displayGroups: DisplayGroup;
  selectedDisplay: SelectedDisplayState;
  relatedDisplayGroups: DisplayGroup;
  dialogOpen: boolean;
  selectDisplay: (name: string, group: string, desc: string, cfg: Config, appId: string, hash: string) => void;
  doSetDialogOpen: (isOpen: boolean) => void;
  stylesComputed: { [key: string]: CSSProperties };
}

const Header: React.FC<HeaderProps> = ({
  cfg,
  appId,
  displayList,
  selectDisplay,
  relatedDisplayGroups,
  displayGroups,
  dialogOpen,
  selectedDisplay,
  doSetDialogOpen,
  stylesComputed,
}) => {
  const [singleLoaded, setSingleLoaded] = useState(selectedDisplay.name !== '');
  const [singleDisplay, setSingleDisplay] = useState(displayList.isLoaded && displayList.list.length <= 1);

  useEffect(() => {
    // handle loading a single display if necessary
    // TODO: Why do this here? Why not in actions/index.js?
    const isSingleDisplay = displayList.isLoaded && displayList.list.length <= 1;
    setSingleDisplay(isSingleDisplay);

    if (!singleLoaded && singleDisplay && selectedDisplay.name !== '') {
      setSingleLoaded(true);
    } else if (!singleLoaded && singleDisplay) {
      selectDisplay(
        displayList.list[0].name,
        displayList.list[0].group,
        displayList.list[0].desc,
        cfg,
        appId,
        window.location.hash,
      );
      setSingleLoaded(true);
    }
  }, [selectedDisplay, displayList, singleLoaded, singleDisplay, selectDisplay, cfg, appId]);

  let displayName;
  let displayDesc = '';
  let iconStyle = { visibility: 'hidden' } as { [key: string]: string | number };
  let pagination;
  const displayLoaded = selectedDisplay.name !== '';
  const nGroups = Object.keys(displayGroups).length;
  const listLoaded = displayList.isLoaded;

  if (displayLoaded) {
    if (nGroups > 1) {
      displayName = `${selectedDisplay.group} /
        ${selectedDisplay.name}`;
    } else {
      // Takes file name and replaces underscores with space to make title
      displayName = selectedDisplay.name.replace(/_/g, ' ');
    }
    if (!singleDisplay) {
      iconStyle = { color: '#aaa', fontSize: 12 };
    }
    displayDesc = selectedDisplay.desc;
    pagination = <Pagination />;
  } else if (singleDisplay) {
    displayName = 'loading...';
  } else if (!dialogOpen && displayList.list.length > 0) {
    displayName = (
      <span>
        <i className="icon-arrow-left" />
        &nbsp;select a display to view...
      </span>
    );
  }
  return (
    <div className={styles.headerContainer} style={stylesComputed.headerContainer}>
      {listLoaded && !singleDisplay && <DisplaySelect setDialogOpen={doSetDialogOpen} />}
      {relatedDisplayGroups && Object.keys(relatedDisplayGroups).length > 0 && (
        <RelatedDisplays setDialogOpen={doSetDialogOpen} />
      )}
      {selectedDisplay.name !== '' && <DisplayInfo singleDisplay={singleDisplay} setDialogOpen={doSetDialogOpen} />}
      <i style={iconStyle} className="fa fa-info-circle" />
      <div className={styles.headerSubContainer} style={stylesComputed.headerSubContainer}>
        <div className={styles.headerNameDescContainer}>
          <div className={styles.headerDisplayName} style={stylesComputed.displayName}>
            {displayName}
          </div>
          <div className={styles.headerDisplayDesc}>{displayDesc}</div>
        </div>
        <div className={styles.headerPaginationContainer}>{pagination}</div>
      </div>
      <HeaderLogo setDialogOpen={doSetDialogOpen} />
    </div>
  );
};

const styleSelector = createSelector(
  appIdSelector,
  windowWidthSelector,
  displayListSelector,
  displayGroupsSelector,
  selectedDisplaySelector,
  relatedDisplayGroupsSelector,
  configSelector,
  dialogOpenSelector,
  (appId, ww, dl, dg, sd, rdg, cfg, dialogOpen) => ({
    stylesComputed: {
      headerContainer: {
        width: ww,
      },
      headerSubContainer: {
        left:
          uiConsts.header.height *
          ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1) + (Object.keys(rdg).length === 0 ? 0 : 1)),
        width:
          ww -
          (uiConsts.header.height *
            ((dl.list.length <= 1 ? 0 : 1) + (sd.name === '' ? 0 : 1) + (Object.keys(rdg).length === 0 ? 0 : 1)) +
            uiConsts.header.logoWidth +
            30),
      },
      displayName: {
        lineHeight: `${sd.desc === '' ? 48 : 26}px`,
        paddingTop: sd.desc === '' ? 0 : 5,
      },
    },
    appId,
    cfg,
    displayList: dl,
    displayGroups: dg,
    selectedDisplay: sd,
    relatedDisplayGroups: rdg,
    dialogOpen,
  }),
);

const mapStateToProps = (state: RootState) => styleSelector(state);

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, unknown, Action>) => ({
  selectDisplay: (name: string, group: string, desc: string, cfg: Config, appId: string, hash: string) => {
    dispatch(setSelectedDisplay({ name, group, desc }));
    dispatch(fetchDisplay(name, group, cfg, appId, hash));
  },
  doSetDialogOpen: (isOpen: boolean) => {
    dispatch(setDialogOpen(isOpen));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
