import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import DisplayInfo from '../DisplayInfo';
import RelatedDisplays from '../RelatedDisplays';
import DisplaySelect from '../DisplaySelect';
import Pagination from '../Pagination';
import HelpInfo from '../HelpInfo';
import { setDialogOpen } from '../../slices/appSlice';
import { windowWidthSelector } from '../../selectors/ui';
import { pageNumSelector, nPerPageSelector, fullscreenSelector, cogDataSelector } from '../../selectors';
import { setLayout } from '../../slices/layoutSlice';
import getCustomProperties from '../../getCustomProperties';
import { useRelatedDisplaysGroup, useSelectedDisplay } from '../../slices/selectedDisplaySlice';
import { useDisplayGroups, useDisplayList } from '../../slices/displayListAPI';
import { DataContext } from '../DataProvider';
import { selectDialogOpen } from '../../selectors/app';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { data: displayList = [], isSuccess } = useDisplayList();
  const displayGroups = useDisplayGroups();
  const relatedDisplayGroups = useRelatedDisplaysGroup();
  const { filteredData } = useContext(DataContext);

  const dialogOpen = useSelector(selectDialogOpen);
  const windowWidth = useSelector(windowWidthSelector);
  const dlLength = displayList?.length || 0;
  const selectedDisplay = useSelectedDisplay();
  const singleDisplay = displayList.length === 1;
  const [headerHeight, logoWidth] = getCustomProperties(['--header-height', '--logo-width']) as number[];

  const n = useSelector(pageNumSelector);
  const totPanels = filteredData.length;
  const npp = useSelector(nPerPageSelector);
  const fullscreen = useSelector(fullscreenSelector);
  const cogData = useSelector(cogDataSelector);
  const totPages = Math.ceil(totPanels / npp);

  const handleChange = (page: number) => {
    dispatch(
      setLayout({
        page,
        type: 'layout',
      }),
    );
  };

  const pageLeft = () => {
    let nn = n - 1;
    if (nn < 1) {
      nn += 1;
    }
    return handleChange(nn);
  };

  const pageRight = () => {
    let nn = n + 1;
    if (nn > totPages) {
      nn -= 1;
    }
    return handleChange(nn);
  };

  const pageFirst = () => {
    handleChange(1);
  };

  const pageLast = () => {
    handleChange(totPages);
  };

  const stylesComputed = {
    headerContainer: {
      width: windowWidth,
    },
    headerSubContainer: {
      left:
        headerHeight *
        ((dlLength <= 1 ? 0 : 1) + (selectedDisplay?.name === '' ? 0 : 1) + (relatedDisplayGroups.length === 0 ? 0 : 1)),
      width:
        windowWidth -
        (headerHeight *
          ((dlLength <= 1 ? 0 : 1) + (selectedDisplay?.name === '' ? 0 : 1) + (relatedDisplayGroups.length === 0 ? 0 : 1)) +
          logoWidth +
          30),
    },
    displayName: {
      lineHeight: `${selectedDisplay?.description === '' ? 48 : 26}px`,
      paddingTop: selectedDisplay?.description === '' ? 0 : 5,
    },
  };

  const handleDialogOpen = (isOpen: boolean) => {
    dispatch(setDialogOpen(isOpen));
  };

  let displayName;
  let displayDesc = '' as string | undefined;
  let iconStyle = { visibility: 'hidden' } as { [key: string]: string | number };
  const displayLoaded = selectedDisplay?.name !== '';
  const nGroups = Object.keys(displayGroups).length;

  if (displayLoaded) {
    if (nGroups > 1) {
      displayName = `/
        ${selectedDisplay?.name}`;
    } else {
      // Takes file name and replaces underscores with space to make title
      displayName = (selectedDisplay?.name || '').replace(/_/g, ' ');
    }
    if (!singleDisplay) {
      iconStyle = { color: '#aaa', fontSize: 12 };
    }
    displayDesc = selectedDisplay?.description;
  } else if (singleDisplay) {
    displayName = 'loading...';
  } else if (!dialogOpen && displayList?.length > 0) {
    displayName = (
      <span className={styles.headerNameDescContainerIcon}>
        <FontAwesomeIcon icon={faArrowLeftLong} />
        &nbsp;select a display to view...
      </span>
    );
  }

  return (
    <div className={styles.headerContainer} style={stylesComputed.headerContainer}>
      {isSuccess && !singleDisplay && <DisplaySelect setDialogOpen={handleDialogOpen} />}
      {relatedDisplayGroups && relatedDisplayGroups.length > 0 && (
        <RelatedDisplays
          setDialogOpen={handleDialogOpen}
          relatedDisplayGroups={relatedDisplayGroups}
          selectedDisplay={selectedDisplay as IDisplayListItem}
        />
      )}
      {selectedDisplay?.name !== '' && (
        <DisplayInfo singleDisplay={singleDisplay} setDialogOpen={handleDialogOpen} totPanels={totPanels} />
      )}
      <i style={iconStyle} className="fa fa-info-circle" />
      <div className={styles.headerSubContainer} style={stylesComputed.headerSubContainer}>
        <div className={styles.headerNameDescContainer}>
          <div className={styles.headerDisplayName} style={stylesComputed.displayName}>
            {displayName}
          </div>
          <div className={styles.headerDisplayDesc}>{displayDesc}</div>
        </div>
        {displayLoaded && (
          <Pagination
            n={n}
            totPanels={totPanels}
            npp={npp}
            dialogOpen={dialogOpen}
            fullscreen={fullscreen}
            cogData={cogData}
            totPages={totPages}
            pageLeft={pageLeft}
            pageRight={pageRight}
            pageFirst={pageFirst}
            pageLast={pageLast}
          />
        )}
      </div>
      <HelpInfo setDialogOpen={handleDialogOpen} />
    </div>
  );
};

export default Header;
