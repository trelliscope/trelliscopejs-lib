import React from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import styles from './UserInfo.module.scss';

interface UserInfoProps {
  fullName: string;
  email: string;
  jobTitle: string;
  otherInfo: string;
  validEmail: boolean;
  setValidEmail: (validEmail: boolean) => void;
  setFullName: (fullName: string) => void;
  setEmail: (email: string) => void;
  setJobTitle: (jobTitle: string) => void;
  setOtherInfo: (otherInfo: string) => void;
  storageItems: [string, string, string, string];
}

const UserInfo: React.FC<UserInfoProps> = ({
  fullName,
  email,
  jobTitle,
  otherInfo,
  validEmail,
  setValidEmail,
  setFullName,
  setEmail,
  setJobTitle,
  setOtherInfo,
  storageItems,
}) => {
  const emailRegex =
    /^[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  const handleValidateEmail = (emailInput: string) => {
    if (emailRegex.test(emailInput) || emailInput === '') {
      setValidEmail(true);
      localStorage.setItem(storageItems[1], emailInput);
    } else {
      setValidEmail(false);
    }
  };

  const handleNameChange = (event: { target: { value: string } }) => {
    setFullName(event.target.value);
    localStorage.setItem(storageItems[0], event.target.value);
  };

  const handleEmailChange = (event: { target: { value: string } }) => {
    handleValidateEmail(event.target.value);
    setEmail(event.target.value);
  };

  const handleJobTitleChange = (event: { target: { value: string } }) => {
    setJobTitle(event.target.value);
    localStorage.setItem(storageItems[2], event.target.value);
  };

  const handleOtherInfoChange = (event: { target: { value: string } }) => {
    setOtherInfo(event.target.value);
    localStorage.setItem(storageItems[3], event.target.value);
  };

  return (
    <div className={styles.userInfoContainer}>
      <DialogContentText className={styles.userInfoContentText}>
        Before exporting the inputs you have provided, we would like to gather some information about you. Please provide at
        least your full name, after which you will be able to click the &apos;Export&apos; tab in this window to proceed with
        the export.
      </DialogContentText>
      <div>
        <TextField
          className={styles.userInfoTextField}
          required
          label="Full Name"
          fullWidth
          value={fullName}
          onChange={handleNameChange}
        />
        <TextField
          className={styles.userInfoTextField}
          label="Email Address"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          error={!validEmail}
          helperText={validEmail ? '' : 'Please enter a valid email address'}
        />
        <TextField
          className={styles.userInfoTextField}
          label="Job Title"
          fullWidth
          value={jobTitle}
          onChange={handleJobTitleChange}
        />
        <TextField
          className={styles.userInfoTextField}
          multiline
          rows={3}
          label="Additional Contact Information"
          fullWidth
          value={otherInfo}
          onChange={handleOtherInfoChange}
        />
      </div>
    </div>
  );
};

export default UserInfo;
