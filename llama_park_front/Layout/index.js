import { useEffect } from 'react';
import { ToastContainer } from "@lidofinance/lido-ui";
import { watchNetwork } from "@wagmi/core";
import { useDisconnect } from "wagmi";
import Router, { useRouter } from 'next/router';
import TopBar from '@containers/TopBar';
import { resetSubmitModalParamFn, setAccountModalOpen } from '@store/ui';
import { dispatch } from '@store/index';
import styled from 'styled-components';


const TabBox = styled.div`
  display: block;
  @media screen and (max-width: 768px) {
      display: none;
  }
`


function Layout({ children, className }) {
  const { disconnect } = useDisconnect();
  const { pathname } = useRouter()

  useEffect(() => {
    const unwatch = watchNetwork(({ chain, chains }) => {
      if (!chain || !chains) {
        if (pathname.includes('profile')) Router.push('/')
        dispatch(setAccountModalOpen(false))
        resetSubmitModalParamFn()
        return
      };
      const isValidChain = chains.some((c) => c.id === chain.id);
      if (!isValidChain) {
        disconnect();
      }
    });
    return () => unwatch();
  }, [disconnect]);


  return (
    <main className={`main bg-blue-500 ${className || ''}`}>
      <TopBar />
      <div className='w-screen'>
        {children}
      </div>
      <ToastContainer />
    </main>
  );
}

export default Layout;
