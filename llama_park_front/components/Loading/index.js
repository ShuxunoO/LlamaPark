import styles from './index.module.scss'
import LoadingIcon from '@icons/loading.svg'
import Refresh from '@icons/refresh.svg'

export default function Loading({ retryFn, retry }) {

  return (
    <div className={styles.root}>
      {retry ? (
        <div className={styles.error}>
          Something went wrong. Try reloading.
          <div className={styles.retryBtn} onClick={retryFn}>
            <Refresh /> Retry
          </div>
        </div>
      ) : (
        <div className="indeterminate">
          <LoadingIcon />
        </div>
      )}
    </div>
  )
};
