import React from 'react';
import { makeStyles } from '@material-ui/core';
import WarningIcon from "@icons/warning.svg";

const useStyles = makeStyles({
  warning: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    background: '#ecc94b',
    color: '#142528',
    textAlign: 'left',
  },
  warningIcon: {
    flexShrink: '0',
    width: '14px',
    height: '14px',
    marginRight: '14px',
  }
});

function Warning() {
  const classes = useStyles();
  return (
    <div className={classes.warning}>
      <WarningIcon className={classes.warningIcon} /> Unstake requests are processed within 7-10 days, subject to entry and exit queue on ethereum network
    </div>
  )

}
export default Warning;
