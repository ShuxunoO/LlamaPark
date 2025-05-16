import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  ledgerWallet,
  safeWallet,
  rabbyWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  imTokenWallet,
  okxWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import merge from "lodash/merge";
import { bitGetWallet } from "./connecters/bitGet/bitGetWallet";
import { IS_PROD } from "@config/env";
import { mainnet, polygon, sepolia } from "@wagmi/core/chains";

const WALLET_CONNECT_PROJECT_ID = "8f20bb08d0342884f1e26fccdce804af";
const APP_NAME = "llama_park";

const walletTheme = merge(lightTheme(), {
  radii: {
    modal: "4px",
    menuButton: "4px",
  },
});

const EthSepolia = {
  id: 11155111,
  name: "ETH Sepolia",
  network: "eth-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH Sepolia",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.infura.io/v3/47dbcd9bab854381a4c9787b1a1513a8"] },
    default: { http: ["https://sepolia.infura.io/v3/47dbcd9bab854381a4c9787b1a1513a8"] },
  },
  blockExplorers: {
    default: { name: "Scroll Sepolia", url: "https://sepolia.scrollscan.com" },
    etherscan: { name: "Scroll Sepolia", url: "https://sepolia.scrollscan.com" },
  },
  testnet: true,
};

const Eth = {
  id: 1,
  name: "Eth",
  network: "ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Eth",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://eth.llamarpc.com"] },
    default: { http: ["https://eth.llamarpc.com"] },
  },
  blockExplorers: {
    default: { name: "Eth", url: "https://etherscan.io" },
    etherscan: { name: "Eth", url: "https://etherscan.io" },
  },
  testnet: false,
};

const WalletProvider = ({ children }) => {
  let _chains = IS_PROD === "true" ? [sepolia] : [sepolia];

  const { chains, publicClient } = configureChains(_chains, [publicProvider()]);

  const recommendedWalletList = [
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
        okxWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
        walletConnectWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
        safeWallet({ chains }),
        rabbyWallet({ chains }),
      ],
    },
  ];

  const othersWalletList = [
    {
      groupName: "Others",
      wallets: [
        coinbaseWallet({ appName: APP_NAME, chains }),
        ledgerWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
        rainbowWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
        bitGetWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
        imTokenWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID }),
      ],
    },
  ];

  const connectors = connectorsForWallets([...recommendedWalletList, ...othersWalletList]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider locale={"en-US"} theme={walletTheme} chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WalletProvider;
