import { Button } from '@lidofinance/lido-ui';
import styles from './index.module.scss'
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useWallet from '@wallets/useWallet';

function BaseButton({ className = '', onClick, children, ...resProps }) {
  const { active } = useWallet();
  const { openConnectModal } = useConnectModal();

  return (
    <Button
      className={`${styles.button} ${className}`}
      size={'xs'}
      {...resProps}
      onClick={active ? onClick : openConnectModal}
    >
      {children}
    </Button>
  );
}

export default BaseButton;
