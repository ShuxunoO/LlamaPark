import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Router, { useRouter } from "next/router";
import useWallet from "@wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { readContract } from "@wagmi/core";

export default function Tabs({ tabs = [] }) {
  const { active, address } = useWallet();
  const { asPath } = useRouter();
  const { openConnectModal } = useConnectModal();

  const go = useCallback(
    (tab) => {
      if (tab.needLogin && !active) {
        openConnectModal();
        return;
      }
      Router.push(tab.path);
    },
    [active]
  );

  return (
    <div className={`${styles.root}`}>
      {tabs.map((tab, i) => {
        return (
          <div
            key={`${tab.name}-${i}`}
            className={`${styles.navItem} ${
              asPath === tab.path ? styles.active : ""
            }`}
            onClick={() => go(tab)}
          >
            {tab.name}
          </div>
        );
      })}
    </div>
  );
}
