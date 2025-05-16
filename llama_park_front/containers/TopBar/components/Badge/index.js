import AddressBadge from '@components/AddressBadge';
import styles from './index.module.scss'


export default function Badge({ address }) {

  return (
    <div className={styles.root} >
      <AddressBadge address={address} mode="dark" />
    </div>
  );
}
