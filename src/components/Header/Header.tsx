import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DisplayInfo from '../DisplayInfo';
import RelatedDisplays from '../RelatedDisplays';
import DisplaySelect from '../DisplaySelect';
import Pagination from '../Pagination';
import HeaderLogo from '../HeaderLogo';
import { fetchDisplay } from '../../actions';
import { setDialogOpen } from '../../slices/appSlice';
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
import { setSelectedDisplay } from '../../slices/selectedDisplaySlice';
import getCustomProperties from '../../getCustomProperties';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const displayList = useSelector(displayListSelector);
  const appId = useSelector(appIdSelector);
  const cfg = useSelector(configSelector);
  const dialogOpen = useSelector(dialogOpenSelector);
  const displayGroups = useSelector(displayGroupsSelector);
  const windowWidth = useSelector(windowWidthSelector);
  const dlLength = Object.keys(displayList).length;
  const selectedDisplay = useSelector(selectedDisplaySelector);
  const relatedDisplayGroups = useSelector(relatedDisplayGroupsSelector);
  const [singleLoaded, setSingleLoaded] = useState(selectedDisplay.name !== '');
  const [singleDisplay, setSingleDisplay] = useState(displayList.isLoaded && displayList.list.length <= 1);
  const [headerHeight] = getCustomProperties(['--header-container']);

  const stylesComputed = {
    headerContainer: {
      width: windowWidth,
    },
    headerSubContainer: {
      left:
      headerHeight *
        ((dlLength <= 1 ? 0 : 1) +
          (selectedDisplay.name === '' ? 0 : 1) +
          (Object.keys(relatedDisplayGroups).length === 0 ? 0 : 1)),
      width:
        windowWidth -
        (headerHeight *
          ((dlLength <= 1 ? 0 : 1) +
            (selectedDisplay.name === '' ? 0 : 1) +
            (Object.keys(relatedDisplayGroups).length === 0 ? 0 : 1)) +
          uiConsts.header.logoWidth +
          30),
    },
    displayName: {
      lineHeight: `${selectedDisplay.desc === '' ? 48 : 26}px`,
      paddingTop: selectedDisplay.desc === '' ? 0 : 5,
    },
  };

  useEffect(() => {
    // handle loading a single display if necessary
    // TODO: Why do this here? Why not in actions/index.js?
    const isSingleDisplay = displayList.isLoaded && displayList.list.length <= 1;
    setSingleDisplay(isSingleDisplay);

    if (!singleLoaded && singleDisplay && selectedDisplay.name !== '') {
      setSingleLoaded(true);
    } else if (!singleLoaded && singleDisplay) {
      dispatch(
        setSelectedDisplay({
          name: displayList.list[0].name,
          group: displayList.list[0].group,
          desc: displayList.list[0].desc,
        }),
      );
      dispatch(fetchDisplay(displayList.list[0].name, displayList.list[0].group, cfg, appId, window.location.hash));
      setSingleLoaded(true);
    }
  }, [selectedDisplay, displayList, singleLoaded, singleDisplay, cfg, appId, dispatch]);

  const handleDialogOpen = (isOpen: boolean) => {
    dispatch(setDialogOpen(isOpen));
  };

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
      {listLoaded && !singleDisplay && <DisplaySelect setDialogOpen={handleDialogOpen} />}
      {relatedDisplayGroups && Object.keys(relatedDisplayGroups).length > 0 && (
        <RelatedDisplays setDialogOpen={handleDialogOpen} />
      )}
      {selectedDisplay.name !== '' && <DisplayInfo singleDisplay={singleDisplay} setDialogOpen={handleDialogOpen} />}
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
      <HeaderLogo setDialogOpen={handleDialogOpen} />
    </div>
  );
};

export default Header;
