import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Text, Loader, Success, Error, Link } from '@lidofinance/lido-ui';
import { resetSubmitModalParamFn, selectSubmitModalParam } from '@store/ui';
import { startCase } from 'lodash';
import { getHostByNet } from '@utils/index';

function SubmitModal() {
  const { open, hash, type, state, center } = useSelector(selectSubmitModalParam)
  const selectedNetwork = useSelector((state) => state.user.selectedNetwork);
  const EXPLORER_HOST = useMemo(() => getHostByNet(selectedNetwork), [selectedNetwork])
  const hashLink = useMemo(() => `${EXPLORER_HOST}/tx/${hash}`, [hash])
  const curState = useMemo(() => {
    return {
      prepare: {
        title: startCase(type),
      },
      pending: {
        title: 'Operation Pending',
        subtitle: `operation pending`,
        icon: <Loader size={'large'} />,
        content: (
          <Text color='secondary' size='xxs'>
            Confirm this transaction in your wallet
          </Text>
        )
      },
      submitted: {
        title: 'Operation Submitted',
        subtitle: `operation submitted`,
        icon: <Loader size={'large'} />,
        content: (
          <Text color='secondary' size='xxs'>
            Please wait
          </Text>
        )
      },
      success: {
        title: 'Operation Successful',
        subtitle: `operation was successful`,
        icon: <Success color={'green'} size={'large'} />,
        content: (
          <Link href={hashLink}>View on Explorer</Link>
        )
      },
      failed: {
        title: 'Operation Failed',
        subtitle: `operation was failed`,
        icon: <Error color={'green'} size={'large'} />,
        content: (
          <Text color='secondary' size='xxs'>
            Please try again
          </Text>
        )
      }
    }[state]
  }, [state, hashLink])

  const handleClose = useCallback((e) => {
    if (!e) return
    resetSubmitModalParamFn()
  }, [])

  return (
    <Modal
      open={open}
      title={curState?.title || type}
      subtitle={curState?.subtitle ? `${type} ${curState.subtitle}` : undefined}
      center={center}
      onClose={state === 'pending' ? undefined : handleClose}

    >
    </Modal>
  );
}

export default SubmitModal;
