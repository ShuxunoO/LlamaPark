import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Router, { useRouter } from "next/router";
import useWallet from "@wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import icon_1 from "@icons/tab_Icon_1.png";
import icon_0 from "@icons/tab_Icon_0.png";
console.log(icon_1);
const icons = [icon_0, icon_1];

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
            } flex items-center justify-center cursor-pointer`}
            onClick={() => go(tab)}
          >
            {
              tab.icon > -1 && (
                <img src={icons[i].src} alt="" className="w-[30px]" />
              )
            }
            {tab.name}
          </div>
        );
      })}
    </div>
  );
}
