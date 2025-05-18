import dynamic from 'next/dynamic';
import styles from './index.module.scss'

const AddressBadge = dynamic(() => import('@components/AddressBadge'), { ssr: false, loading: () => <div>Loading...</div> });

export default function Badge({ address }) {

  return (
    <div className={styles.root} >
      <AddressBadge address={address} mode="dark" />
    </div>
  );
}
