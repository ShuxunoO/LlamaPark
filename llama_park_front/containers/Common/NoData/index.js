import styles from './index.module.scss'

export default function NoData({ length }) {

  return (
    <div className={styles.root}>
      {length ? 'Yay! You have seen it all' : 'No data'}
    </div>
  );
}