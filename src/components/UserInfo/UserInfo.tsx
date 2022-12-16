import React from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import styles from './UserInfo.module.scss';

interface UserInfoProps {
  fullName: string;
  email: string;
  jobTitle: string;
  otherInfo: string;
  handleNameChange: (event: {
    target: {
      value: string;
    };
  }) => void;
  handleEmailChange: (event: {
    target: {
      value: string;
    };
  }) => void;
  handleJobTitleChange: (event: {
    target: {
      value: string;
    };
  }) => void;
  handleOtherInfoChange: (event: {
    target: {
      value: string;
    };
  }) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  fullName,
  email,
  jobTitle,
  otherInfo,
  handleNameChange,
  handleEmailChange,
  handleJobTitleChange,
  handleOtherInfoChange,
}) => (
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

export default UserInfo;
