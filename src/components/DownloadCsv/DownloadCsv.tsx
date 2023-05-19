import React, { useContext } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../DataProvider';
import { useDisplayMetas } from '../../slices/displayInfoAPI';
import styles from './DownloadCsv.module.scss';
import { META_TYPE_FACTOR, MISSING_TEXT } from '../../constants';
import { getLabelFromFactor } from '../../utils';

interface DownloadCsvProps {
  displayInfo: IDisplay;
  setCsvDownloaded: (csvDownloaded: boolean) => void;
  fullName: string;
  email: string;
  jobTitle: string;
}

interface Data {
  [key: string]: {
    [key: string]: string | null;
  };
}

const DownloadCsv: React.FC<DownloadCsvProps> = ({ displayInfo, setCsvDownloaded, fullName, email, jobTitle }) => {
  const { allData } = useContext(DataContext);
  const displayMetas = useDisplayMetas();
  const includedMetaVars = displayInfo.inputs?.feedbackInterface.includeMetaVars || [];
  const data: Data = {};
  const cols: string[] = [];

  // This loop basically goes over the local storage keys and checks if they are from the current display
  // If they are we split the key by _:_ and get the panelKey and the column name. We then set the data object to
  // have the panelKey as a key and the column name as a key and the value as the value from local storage.

  // CSV Column GENERATION and Data Object to be used for Rows //

  Object.keys(localStorage).forEach((key) => {
    // check if the key in local storage is from the current display
    if (key.includes(displayInfo.name)) {
      if (key.includes('_:_')) {
        const parts = key.split('_:_');
        const panelKey = parts[2];
        if (data[panelKey] === undefined) {
          data[panelKey] = {};
        }
        // strip out all /n and add a space for items in the text input that have a new line
        data[panelKey][parts[3]] = localStorage.getItem(key)?.replace(/[\n[\],]/g, ' ') || null;

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
      const idx = allData.map((panelData) => panelData.__PANEL_KEY__).indexOf(panelKey);
      if (idx > -1) {
        const panelWithInput = allData[idx];
        includedMetaVars.forEach((metaVar) => {
          // if the meta var is a factor, we need to get the label from the factor util otherwise our csv will have numbers when it needs labels
          const dispMetaFound = displayMetas.find((meta) => meta.varname === metaVar);
          if (dispMetaFound?.type === META_TYPE_FACTOR) {
            const factorLabel = getLabelFromFactor(panelWithInput[metaVar] as number, dispMetaFound.levels as string[]);
            return rowColumnData.push(factorLabel === MISSING_TEXT ? '' : factorLabel);
          }
          return rowColumnData.push(panelWithInput[metaVar]);
        });
      }
    }

    // then we add the rest of the input data
    cols.forEach((col) => rowColumnData.push(data[panelKey][col]));

    return rowColumnData;
  });

  // add panel key and all includedMetaVars to the front of the cols for the header,
  // we do this last to avoid undefined values messing up the above loops
  cols.unshift('__PANEL_KEY__', ...includedMetaVars);

  const downloadCsv = () => {
    const csvString = [cols.join(','), ...rows.map((d) => d.join(','))].join('\n');
    const csvFile = new Blob([csvString], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${displayInfo.name}_${fullName}_${email}_${jobTitle}_${
      new Date().toISOString().split('T')[0]
    }.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
    setCsvDownloaded(true);
  };

  return (
    <div className={styles.downloadCsvContainer}>
      <DialogContentText id="alert-dialog-description" className={styles.downloadCsvContentText}>
        <span className={styles.downloadCsvDescription}>
          {`A csv file of the inputs you provided has been created. By clicking the 'Compose Email' on the next step, an email will be drafted and opened in your email client to relay this csv file back to us, at ${displayInfo.inputs?.feedbackInterface.feedbackEmail}.`}
        </span>
        <span>
          {`To complete the email, use the 'Download csv' button to download the csv and add it as an attachment to the email before sending. As an alternative, you can download the csv file and compose your own email, sending it to us at ${displayInfo.inputs?.feedbackInterface.feedbackEmail}.`}
        </span>
      </DialogContentText>
      <div className={styles.downloadCsvWrapperCenter}>
        <Button
          variant="contained"
          color="primary"
          className={styles.downloadCsvButton}
          endIcon={<FontAwesomeIcon icon={faDownload} />}
          onClick={downloadCsv}
        >
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default DownloadCsv;
