import React, { useContext } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { unparse } from 'papaparse';
import { DataContext } from '../DataProvider';
import { useDisplayMetas } from '../../slices/displayInfoAPI';
import styles from './DownloadCsv.module.scss';
import { META_TYPE_FACTOR, MISSING_TEXT } from '../../constants';
import { getLabelFromFactor } from '../../utils';
import { useConfig } from '../../slices/configAPI';

interface DownloadCsvProps {
  displayInfo: IDisplay;
  setCsvDownloaded: (csvDownloaded: boolean) => void;
  fullName: string;
  email: string;
  jobTitle: string;
  hasEmail: boolean;
}

interface Data {
  [key: string]: {
    [key: string]: string | null;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DownloadCsv: React.FC<DownloadCsvProps> = ({ displayInfo, setCsvDownloaded, fullName, email, jobTitle, hasEmail }) => {
  const { allData } = useContext(DataContext);
  const displayMetas = useDisplayMetas();
  const includedMetaVars = displayInfo.inputs?.feedbackInterface.includeMetaVars || [];
  const data: Data = {};
  const cols: string[] = [];

  const { data: configObj } = useConfig();

  // This loop basically goes over the local storage keys and checks if they are from the current display
  // If they are we split the key by _:_ and get the panelKey and the column name. We then set the data object to
  // have the panelKey as a key and the column name as a key and the value as the value from local storage.

  // CSV Column GENERATION and Data Object to be used for Rows //

  Object.keys(localStorage).forEach((key) => {
    // check if the key in local storage is from the current display
    if (key.includes(displayInfo.name)) {
      if (key.includes('_:_') && !key.includes('trelliscope_views')) {
        const parts = key.split('_:_');
        const panelKey = parts[2];
        if (data[panelKey] === undefined) {
          data[panelKey] = {};
        }
        data[panelKey][parts[3]] = localStorage.getItem(key) || null;

        if (cols.indexOf(parts[3]) < 0) {
          cols.push(parts[3]);
        }
      }
    }
  });

  // take the cols and make them the header of the csv
  // then take the data and make it the body of the csv with a space for undefined values if it doesnt exist for the column

  // CSV ROW GENERATION //

  const rows = Object.keys(data).map((panelKey) => {
    const rowColumnData = [];
    // the first item in each row needs to be the panel key
    rowColumnData.push(panelKey);
    // if there are meta vars we want to include, we need to get them from the allData object
    if (includedMetaVars.length > 0) {
      // for each includedMetaVar we need to grab it from data and push it to the rowColumnData
      includedMetaVars.forEach((metaVar) => {
        const metaFound = displayMetas.find((meta) => meta.varname === metaVar);
        // we need to loop over all of the data and build up the panelKey that matches the current panelKey so we can grab the right data
        allData.forEach((panelData) => {
          const panelCheckArr: string[] = [];
          displayInfo?.keycols.forEach((keycol) => {
            const metaFound2 = displayMetas.find((meta) => meta.varname === keycol);
            if (metaFound2?.type === META_TYPE_FACTOR) {
              const factorLabel = getLabelFromFactor(panelData[keycol] as number, metaFound2.levels as string[]);
              panelCheckArr.push(factorLabel);
              return;
            }
            panelCheckArr.push(panelData[keycol] as string);
          });
          const panelCheck = panelCheckArr.join('_');
          if (panelCheck === panelKey) {
            if (metaFound?.type === META_TYPE_FACTOR) {
              const factorLabel = getLabelFromFactor(panelData[metaVar] as number, metaFound.levels as string[]);
              return rowColumnData.push(factorLabel === MISSING_TEXT ? '' : factorLabel);
            }
            return rowColumnData.push(panelData[metaVar] === undefined ? '' : panelData[metaVar]);
          }
          return null;
        });
      });
    }

    // then we add the rest of the input data
    cols.forEach((col) => rowColumnData.push(data[panelKey][col]));

    return rowColumnData;
  });

  // add panel key and all includedMetaVars to the front of the cols for the header,
  // we do this last to avoid undefined values messing up the above loops
  cols.unshift('__PANEL_KEY__', ...includedMetaVars);

  const downloadCsv = () => {
    const csvString = unparse([cols, ...rows]);
    // const csvString = [cols.join(','), ...rows.map((d) => d.join(','))].join('\n');
    const csvFile = new Blob([csvString], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${displayInfo.name}_export_inputs_${new Date().toISOString().split('T')[0]}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
    setCsvDownloaded(true);
  };

  return (
    <div className={styles.downloadCsvContainer}>
      {hasEmail ? (
        <DialogContentText id="alert-dialog-description" className={styles.downloadCsvContentText}>
          <span className={styles.downloadCsvDescription}>
            {`A csv file of the inputs you provided has been created. By clicking the 'Compose Email' on the next step, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.inputs?.feedbackInterface.feedbackEmail}.`}
          </span>
          <span>
            {`To complete the email, use the 'Download csv' button to download the csv and add it as an attachment to the email before sending. As an alternative, you can download the csv file and compose your own email, sending it to us at ${displayInfo.inputs?.feedbackInterface.feedbackEmail}.`}
          </span>
        </DialogContentText>
      ) : (
        <DialogContentText id="alert-dialog-description" className={styles.downloadCsvContentText}>
          <span className={styles.downloadCsvDescription}>
            A csv file of the inputs you provided has been created. You can download the csv by clicking the button below.
          </span>
        </DialogContentText>
      )}

      <div className={styles.downloadCsvWrapperCenter}>
        <Button
          variant="contained"
          sx={{ color: configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText }}
          className={styles.downloadCsvButton}
          endIcon={
            <FontAwesomeIcon
              color={configObj?.theme?.isLightTextOnDark ? configObj?.theme?.lightText : configObj?.theme?.darkText}
              icon={faDownload}
            />
          }
          onClick={downloadCsv}
          data-testid="download-csv-button"
        >
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default DownloadCsv;
