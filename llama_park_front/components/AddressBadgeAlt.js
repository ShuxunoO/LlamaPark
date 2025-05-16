import { makeStyles } from '@material-ui/core';
import { Address, Identicon } from '@lidofinance/lido-ui';
import { addressShortened } from '@utils/index';
import AddressIcon from './AddressIcon';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    margin: '8px 0px',
  },
  address: {
    marginLeft: '8px',
    fontSize: '16px',
    lineHeight: '1.2em',
    fontWeight: '800'
  }
});

export default function AddressBadgeAlt({ address, mode }) {
  const classes = useStyles();
  if (!address) return null;

  return (
    <div className={classes.root}>
      {/* <Identicon address={address ?? ''} /> */}
      <AddressIcon address={address} />
      <Address address={addressShortened(address) ?? ''} symbols={6} className={classes.address} />
    </div>
  );
}
