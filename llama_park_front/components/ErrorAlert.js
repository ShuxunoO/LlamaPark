import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useCallback } from 'react';

function ErrorAlert() {
  // todo: fix error message disappering before the alert box does
  // const open = Boolean(error);

  // const handleClose = useCallback((e, reason) => {
  //   if (reason !== 'clickaway') {
  //     resetError();
  //   }
  // }, []);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      autoHideDuration={20000}
      onClose={handleClose}
      disableWindowBlurListener
    >
      <Alert onClose={handleClose} severity='error'>
        {error}
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;
