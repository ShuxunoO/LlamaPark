import React, { useEffect } from 'react';
import Head from 'next/head';
import { Provider } from "react-redux";
import store from '@store/index';
import { CookieThemeProvider } from "@lidofinance/lido-ui";
import '@styles/index.scss';
import WalletProvider from '@wallets/WalletProvider'
import { EXPLORER_HOST_ETH, EXPLORER_HOST_POLYGON, EXPLORER_HOST_ETH_TEST } from "@config/env";
import '../globals.css';
import { useRouter } from 'next/router';
import { dispatch } from '@store/index';
import { setInviterAddress } from '@store/user';

export const runtime = 'experimental-edge';

function MyApp({ Component, pageProps }) {
  const router = useRouter(); 
  useEffect(() => {
    const inviterAddress = router.query.inviterAddress;
    if (inviterAddress) {
      dispatch(setInviterAddress(inviterAddress));
    } else {
      dispatch(setInviterAddress(''));
    }
  }, [router.query.inviterAddress]);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    // save the default network in localStorage
    window.localStorage.setItem("EXPLORER_HOST", EXPLORER_HOST_ETH_TEST);
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <title>Llama Park</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta
          name="google-site-verification"
          content="X_UCDHzIzPVDU94YLZckI0kjAqYD6t8uLLLosmvysDM"
        />
      </Head>
      <Provider store={store}>
        <CookieThemeProvider overrideThemeName={"dark"}>
          <WalletProvider>
            <Component {...pageProps} />
          </WalletProvider>
        </CookieThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;