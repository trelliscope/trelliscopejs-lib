import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import Joyride from 'react-joyride';
import ErrorSnack from './components/ErrorSnack';
import { setAppID, setFullscreen, setSinglePageApp, setOptions, setPaths, setErrorMessage } from './slices/appSlice';
import { windowResize, setAppDims } from './slices/uiSlice';
import DataProvider from './components/DataProvider';
import type { IDataClient } from './DataClient';
import { selectErrorMessage } from './selectors/app';
import Header from './components/Header';

import './assets/styles/main.css';
import Sidebar from './components/Sidebar';
import ContentContainer from './components/ContentContainer';
import { useDisplayInfo } from './slices/displayInfoAPI';
import { setFilterView } from './slices/filterSlice';
import { filterViewSelector } from './selectors';
import { selectHashFilterView } from './selectors/hash';

interface AppProps {
  client: IDataClient;
  config: string;
  id: string;
  singlePageApp?: boolean;
  options?: AppOptions;
  fullscreen?: boolean;
  appDims: { width: number; height: number };
}

const App: React.FC<AppProps> = ({ client, config, id, singlePageApp, options, fullscreen, appDims }) => {
  const dispatch = useDispatch();
  const errorMsg = useSelector(selectErrorMessage);
  const filterViews = useSelector(filterViewSelector);
  const { data: displayInfo } = useDisplayInfo();
  const handleClose = () => {
    dispatch(setErrorMessage(''));
  };

  const tour = localStorage.getItem('trelliscope_tour');

  const steps = [
    {
      target: '#sort-add-icon',
      content:
        'You can add a sort here. Clicking the pill will change the sort order. Sorts can be dragged to re-order by using the drag handle. ',
    },
    {
      target: '#column-control',
      content:
        'You can adjust the amount of columns in the grid. If table view is active, you can hide columns or pin them.',
    },
    {
      target: '#label-control',
      content: 'You can add labels here. The label will then appear on the panel.',
    },
    {
      target: '#view-control',
      content:
        'Views are used to change the layout, filters, sorts and labels all at once. You are able to create new views which are saved locally.',
    },
    {
      target: '#layout-control',
      content: 'You can change the layout to be a grid or a table. In table view, labels are present as columns.',
    },
    {
      target: '#display-control',
      content: 'If there are multiple displays you can change displays here.',
    },
    {
      target: '#share-control',
      content: 'You can get a shareable link to the current view here.',
    },
    {
      target: '#export-control',
      content: 'You can get an exportable download here of the current inputs in csv format.',
    },
    {
      target: '#help-control',
      content:
        'You can see a general overview of the application here and how to use it. You can also re-enable this tour if needed.',
    },
    {
      target: '#fullscreen-control',
      content: 'You can toggle fullscreen mode here.',
    },
    {
      target: '#filter-drawer-button',
      content:
        'This will expand the filter drawer where you can add, remove, and edit filters. Filters are also draggable to re-order. You can also enable the label or sort right from the filter.',
    },
    {
      target: '#panel-control',
      content:
        'If multiple images are present you can change the selected image in the top left of a panel. You can hover over the panel and in the top right you can expand the panel for a closer look.',
    },
  ];

  const handleCallBack = (event: { status: string }) => {
    if (event?.status === 'skipped' || event?.status === 'finished') {
      localStorage.setItem('trelliscope_tour', 'skipped');
    }
  };

  useEffect(() => {
    const urlHash = selectHashFilterView();
    if (urlHash.length === 0) {
      const inactiveFilters = filterViews.inactive.filter((filter) => !displayInfo?.state?.filterView?.includes(filter));
      dispatch(
        setFilterView({ name: { active: displayInfo?.state?.filterView || [], inactive: inactiveFilters }, which: 'set' }),
      );
    }
  }, [displayInfo?.state?.filterView]);

  useEffect(() => {
    dispatch(setAppID(id));
    dispatch(setPaths(config));
    dispatch(setOptions(options));
    dispatch(setFullscreen(fullscreen));
    dispatch(setSinglePageApp(singlePageApp));
    dispatch(windowResize(appDims));
    dispatch(setAppDims(appDims));
  }, [appDims, config, dispatch, fullscreen, id, options, singlePageApp]);

  return (
    <DataProvider client={client}>
      <SnackbarProvider>
        <Box sx={{ display: 'flex', height: 'inherit' }}>
          <Joyride
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            run={tour !== 'skipped'}
            steps={steps}
            callback={handleCallBack}
            continuous
            showSkipButton
            disableScrollParentFix
            spotlightClicks
            locale={{
              last: 'End Tour',
              skip: 'Skip Tour',
            }}
            styles={{
              options: {
                primaryColor: '#4489FF',
                zIndex: 9000,
              },
            }}
          />
          <Header />
          <Sidebar />
          <ContentContainer />
          <ErrorSnack errorMsg={errorMsg} handleClose={handleClose} />
        </Box>
      </SnackbarProvider>
    </DataProvider>
  );
};

App.defaultProps = {
  singlePageApp: false,
  options: {},
  fullscreen: false,
};

export default App;
