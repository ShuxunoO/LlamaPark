import React, { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import Badge from './components/Badge';
import Logo from '@components/Logo';
import AccountInfo from './components/AccountInfo';
import styles from './index.module.scss'
import Button from './components/Button';
import useWallet from '@wallets/useWallet';
import BackIcon from '@icons/arrowLeft.svg'
import Router, { useRouter } from 'next/router';
import Tabs from '@components/Tabs';
import tabList from "@config/pageConfig";



function TopBar({ type, backPath, children }) {
  const wallet = useWallet();
  const { active, address } = wallet


  const goBack = useCallback(() => {
    backPath ? Router.push(backPath) : Router.back()
  }, [backPath])


  return (
    <div className={styles.topBar}>
      <div className={styles.title}>
        <Logo/>
        <Tabs tabs={tabList} />
        <div className={styles.rightTop}>{active ? <Badge address={address} /> : <Button />}</div>
        <AccountInfo wallet={wallet} />
      </div>
    </div>
  );
}

export default TopBar;
