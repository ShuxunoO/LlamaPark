import { makeStyles } from '@material-ui/core';
import { dispatch } from '@store/index';
import { setAccountModalOpen } from '@store/ui';
import { useCallback } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { addressShortened } from '@utils/index';
import AddressIcon from './AddressIcon';

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: '100px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px',
    cursor: 'pointer',
    '&& p': {
      lineHeight: '24px',
      margin: 0,
      marginLeft: '12px',
      marginRight: '6px',
    },
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.2)',
    '&& p': {
      color: '#151515',
    },
  },
  light: {
    background: '#F7F7F7',
    '&& p': {
      color: '#151515',
    },
  },
}));

export default function AddressBadge({ address }) {
  const classes = useStyles();
  const openAccountInfo = useCallback(() => {
    dispatch(setAccountModalOpen(true))
  }, [])

  return (
    <div className={`${classes.root} ${classes["light"]}`} onClick={openAccountInfo}>
      <p className='hidden md:inline'>{addressShortened(address, 4, 4)}</p>
      {/* <Jazzicon diameter={32} seed={jsNumberForAddress(address)} /> */}
      <AddressIcon address={address} />
    </div>
  );
}
