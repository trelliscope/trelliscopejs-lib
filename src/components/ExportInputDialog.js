import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function ExportInputDialog({ open, handleClose, displayInfo }) {
  const keyMatch = new RegExp(`^${displayInfo.group}_:_${displayInfo.name}`);

  const data = {};
  const cols = [];
  Object.keys(localStorage).forEach((key) => {
    if (keyMatch.test(key)) {
      const parts = key.split('_:_');
      const panelKey = parts[2];
      if (data[panelKey] === undefined) {
        data[panelKey] = {};
      }
      data[panelKey][parts[3]] = localStorage.getItem(key);
      if (cols.indexOf(parts[3]) < 0) {
        cols.push(parts[3]);
      }
    }
  });

  const header = ['panelKey'];
  header.push(cols);
  const rows = Object.keys(data).map((kk) => {
    const row = [kk];
    row.push(cols.map((cc) => (data[kk][cc] ? data[kk][cc] : '')));
    return row;
  });

  const clearInputs = () => {
    Object.keys(localStorage).forEach((key) => {
      if (keyMatch.test(key)) {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Export user inputs</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`The following user input can be copied and sent to ${displayInfo.input_email}.`}
          </DialogContentText>
          <FormControl fullWidth>
            <TextField
              inputProps={{ style: { fontFamily: 'courier, monospace', fontSize: 14, color: '#777' } }}
              id="outlined-multiline-static"
              label="csv"
              multiline
              disabled
              rows={Math.min(rows.length + 1, 10)}
              defaultValue={[header.join(','), ...rows.map((d) => d.join(','))].join('\n')}
              variant="outlined"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearInputs}>
            Clear all inputs
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
