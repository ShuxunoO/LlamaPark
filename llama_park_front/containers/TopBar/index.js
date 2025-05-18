import React, { useCallback, useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
// import Badge from './components/Badge';
import Logo from '@components/Logo';
import AccountInfo from './components/AccountInfo';
import styles from './index.module.scss'
import Button from './components/Button';
import useWallet from '@wallets/useWallet';
import BackIcon from '@icons/arrowLeft.svg'
import Router, { useRouter } from 'next/router';
import Tabs from '@components/Tabs';
import tabList from "@config/pageConfig";
import dynamic from 'next/dynamic';

const Badge = dynamic(() => import('./components/Badge'), {
  ssr: false,
  loading: () => <div className={styles.badgePlaceholder}></div>
});

function TopBar({ type, backPath, children }) {
  const wallet = useWallet();
  const { active, address } = wallet;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goBack = useCallback(() => {
    backPath ? Router.push(backPath) : Router.back()
  }, [backPath])

  return (
    <div className={styles.topBar}>
      <div className={styles.title}>
        <Logo />
        <Tabs tabs={tabList} />
        <div className={styles.rightTop}>
          {!isMounted ? null : active ? <Badge address={address} /> : <Button />}
        </div>
        <AccountInfo wallet={wallet} />
      </div>
    </div>
  );
}

export default TopBar;
