import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, IconButton, ClickAwayListener } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import PanelZoomLabels from '../PanelZoomLabels/PanelZoomLabels';
import styles from './PanelDialog.module.scss';
import { PanelGraphic } from '../Panel';
import { panelDialogIsOpenSelector, selectBasePath } from '../../selectors/app';
import { panelSrcGetter, snakeCase } from '../../utils';
import { selectLayout, selectNumPerPage, selectPage, setLayout } from '../../slices/layoutSlice';
import { setPanelDialog } from '../../slices/appSlice';
import { META_TYPE_PANEL } from '../../constants';
import VariableSelector from '../VariableSelector';
import { singlePageAppSelector } from '../../selectors';

interface PanelDialogProps {
  data: Datum[];
  filteredData: Datum[];
  open: boolean;
  panel: IPanelMeta;
  source: string;
  onClose: () => void;
  index: number;
}

interface PanelExtended extends IPanelMeta {
  sourcePath: string;
}

const PanelDialog: React.FC<PanelDialogProps> = ({ data, filteredData, open, panel, source, onClose, index }) => {
  const displayMetas = useDisplayMetas();
  const panelMetas = displayMetas.filter((meta) => meta.type === META_TYPE_PANEL && meta.varname !== panel?.varname);
  const dispatch = useDispatch();
  const n = useSelector(selectPage);
  const { nrow, ncol, viewtype } = useSelector(selectLayout);
  const totPanels = filteredData.length;
  const npp = useSelector(selectNumPerPage);
  const totPages = Math.ceil(totPanels / npp);
  const basePath = useSelector(selectBasePath);
  const [curMetaData, setCurMetaData] = useState<Datum>();
  const [curSource, setCurSource] = useState(source);
  const [curIndex, setCurIndex] = useState(index);
  const { data: displayInfo } = useDisplayInfo();
  const labels = useDisplayMetas();
  const [selectedVariables, setSelectedVariables] = useState<{ varname: string }[]>([]);
  const [variableSelectorIsOpen, setVariableSelectorIsOpen] = useState(false);
  const [anchorSelectorEl, setAnchorSelectorEl] = useState<null | HTMLElement>(null);
  const [panelSources, setPanelSources] = useState<PanelExtended[]>([]);
  const panelDialogOpen = useSelector(panelDialogIsOpenSelector);
  const singlePageApp = useSelector(singlePageAppSelector);

  useEffect(() => {
    setPanelSources(
      selectedVariables.map(
        (variable) =>
          ({
            ...variable,
            sourcePath: curMetaData?.[variable.varname],
          } as PanelExtended),
      ),
    );
  }, [curMetaData, panel?.varname, selectedVariables]);

  useEffect(() => {
    setCurSource(source);
  }, [source]);

  useEffect(() => {
    setCurIndex(index);
  }, [index]);

  useEffect(() => {
    if (data) {
      const foundPanel = data[curIndex];
      setCurMetaData(foundPanel);
      setCurSource(foundPanel?.[panel?.varname] as string);
    }
  }, [curIndex, data, panel?.varname]);

  const handleClose = () => {
    setCurIndex(index);
    setSelectedVariables([]);
    onClose();
  };

  const handleChange = (page: number) => {
    dispatch(
      setLayout({
        page,
        type: 'layout',
      }),
    );
  };

  const pageLeft = () => {
    if (n === 1 && curIndex === 0) {
      return null;
    }

    const foundPanel = data[curIndex - 1];
    if (curIndex === 0) {
      setCurIndex(viewtype === 'table' ? nrow - 1 : nrow * ncol - 1);
      let nn = n - 1;
      if (nn < 1) {
        nn += 1;
      }
      return handleChange(nn);
    }
    setCurMetaData(foundPanel);
    setCurIndex(curIndex - 1);
    setCurSource(foundPanel?.[panel?.varname] as string);
    dispatch(
      setPanelDialog({
        open: true,
        source: curSource,
        index: curIndex - 1,
      }),
    );

    return null;
  };

  const pageRight = () => {
    if (n === totPages && curIndex === data.length - 1) {
      return null;
    }
    const foundPanel = data[curIndex + 1];
    if (curIndex === data.length - 1) {
      setCurIndex(0);
      let nn = n + 1;
      if (nn > totPages) {
        nn -= 1;
      }
      return handleChange(nn);
    }
    setCurMetaData(foundPanel);
    setCurIndex(curIndex + 1);
    setCurSource(foundPanel?.[panel?.varname] as string);
    dispatch(
      setPanelDialog({
        open: true,
        source: curSource,
        index: curIndex + 1,
      }),
    );
    return null;
  };

  useHotkeys('right', pageRight as () => void, { enabled: singlePageApp && panelDialogOpen }, [
    n,
    totPanels,
    npp,
    data,
    curIndex,
    totPages,
    panel,
    curSource,
  ]);
  useHotkeys('left', pageLeft as () => void, { enabled: singlePageApp && panelDialogOpen }, [
    n,
    totPanels,
    npp,
    data,
    curIndex,
    totPages,
    panel,
    curSource,
  ]);

  const handleVariableSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorSelectorEl(anchorSelectorEl ? null : event.currentTarget);
    setVariableSelectorIsOpen(!variableSelectorIsOpen);
  };

  const handleSelectorChange = (event: React.SyntheticEvent<Element, Event>, value: { varname: string }[]) => {
    setSelectedVariables(value);
  };

  return (
    <Dialog
      maxWidth="lg"
      className={styles.panelDialog}
      classes={{ paper: styles.panelDialogInner }}
      open={open}
      onClose={handleClose}
      data-testid="panel-dialog"
    >
      <ClickAwayListener
        mouseEvent="onMouseUp"
        onClickAway={() => {
          setVariableSelectorIsOpen(false);
          setAnchorSelectorEl(null);
        }}
      >
        <Box>
          <Button
            sx={{
              color: '#000000',
              textTransform: 'unset',
              fontSize: '15px',
            }}
            type="button"
            data-testid="variable-selector-button"
            onClick={handleVariableSelectorClick}
            endIcon={<FontAwesomeIcon icon={variableSelectorIsOpen ? faChevronUp : faChevronDown} />}
          >
            Show Additional Panels
          </Button>
          <VariableSelector
            isOpen={variableSelectorIsOpen}
            setVariableSelectorIsOpen={setVariableSelectorIsOpen}
            setAnchorEl={setAnchorSelectorEl}
            selectedVariables={selectedVariables}
            metaGroups={null}
            anchorEl={anchorSelectorEl}
            displayMetas={panelMetas as unknown as { [key: string]: string }[]}
            handleChange={
              handleSelectorChange as unknown as (
                event: React.SyntheticEvent<Element, Event>,
                value: { [key: string]: string }[],
              ) => void
            }
            hasTags={false}
            disablePortal
          />
        </Box>
      </ClickAwayListener>
      <div className={styles.panelDialogGraphic}>
        <Box sx={{ alignItems: 'center', display: 'flex' }}>
          <IconButton data-testid="paginate-left" disabled={n === 1 && curIndex === 0} onClick={pageLeft}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </IconButton>
        </Box>
        {curSource && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <Box
              sx={{ minWidth: panelSources.length === 0 ? '800px' : '0px', flex: '1 0 50%' }}
              data-testid="panel-dialog-image"
            >
              <PanelGraphic
                type={panel?.paneltype}
                src={
                  panel?.source?.isLocal === false
                    ? curSource
                    : panelSrcGetter(basePath, curSource, snakeCase(displayInfo?.name || '')).toString()
                }
                alt={panel?.label}
                key={`${panel?.source}_${panel?.label}`}
                imageWidth={-1}
                aspectRatio={panel?.aspect}
                port={panel?.source?.port}
                sourceType={panel?.source?.type}
                name={panel?.varname}
                sourceClean={curSource}
              />
            </Box>
            {panelSources.map((panelSource: PanelExtended) => (
              <Box sx={{ flex: '0 0 50%' }} key={panelSource?.varname}>
                <PanelGraphic
                  type={panelSource?.paneltype}
                  src={
                    panelSource?.source?.isLocal === false
                      ? panelSource.sourcePath
                      : panelSrcGetter(basePath, panelSource.sourcePath, snakeCase(displayInfo?.name || '')).toString()
                  }
                  alt={panelSource?.label}
                  key={`${panelSource?.source}_${panelSource?.label}`}
                  imageWidth={-1}
                  aspectRatio={panelSource?.aspect}
                  port={panelSource?.source?.port}
                  sourceType={panelSource?.source?.type}
                  name={panelSource?.varname}
                  sourceClean={panelSource.sourcePath}
                />
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ alignItems: 'center', display: 'flex' }}>
          <IconButton
            data-testid="paginate-right"
            disabled={n === totPages && curIndex === data.length - 1}
            onClick={pageRight}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </IconButton>
        </Box>
      </div>
      <div className={styles.panelDialogLabelsWrapper}>
        <PanelZoomLabels data={curMetaData || {}} inputs={displayInfo?.inputs?.inputs || []} labels={labels} />
      </div>
      <DialogActions>
        <Button data-testid="panel-dialog-close" aria-label="display info close" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PanelDialog;
