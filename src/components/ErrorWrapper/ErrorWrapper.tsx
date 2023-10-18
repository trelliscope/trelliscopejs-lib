import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import ErrorSnack from '../ErrorSnack';
import styles from './ErrorWrapper.module.scss';
import { selectErrorMessage } from '../../selectors/app';
import { setErrorMessage } from '../../slices/appSlice';

interface ErrorWrapperProps {
  children: React.ReactNode;
}

const ErrorWrapper: React.FC<ErrorWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const errorMsg = useSelector(selectErrorMessage);
  const [errorInfo, setErrorInfo] = useState('');

  const handleClose = () => {
    dispatch(setErrorMessage(''));
  };
  const handleError = (error: Error, info: { componentStack: string }) => {
    setErrorInfo(info?.componentStack);
    dispatch(setErrorMessage(error.message));
  };

  return (
    <ErrorBoundary
      fallback={<ErrorSnack errorMsg={errorMsg} handleClose={handleClose} errorInfo={errorInfo} />}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorWrapper;
