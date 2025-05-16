import { IS_PROD } from "./env";

export const POLYGON = 137;
export const BLAST = 81457;
export const SCROLL = 534352;
export const ETH = 1;
export const BLAST_TEST = 168587773;
export const SCROLL_TEST = 534351;
export const ETH_TEST = 11155111;

export const BLAST_TYPE = 'blast';
export const SCROLL_TYPE = 'scroll';
export const ETH_TYPE = 'eth';
export const ETH_TEST_TYPE = 'eth_test';
export const POLYGON_TYPE = 'polygon';

export const DEFAULT_CHAIN_ID = BLAST;

export const SUPPORTED_CHAIN_IDS = IS_PROD === 'true' ? [BLAST] : [SCROLL_TEST, BLAST_TEST];

export const CHAIN_NAMES_MAP = {
  [BLAST]: "Blast",
  [BLAST_TEST]: "Blast Sepolia",
  [SCROLL]: "Scroll",
  [SCROLL_TEST]: "Scroll Sepolia",
  [POLYGON]: "Polygon",
};

export const RPC_PROVIDERS = {
  [POLYGON]: [
    "https://polygon-bor.publicnode.com",
    "https://rpc.ankr.com/polygon",
    "https://polygon.llamarpc.com",
    'https://polygon-rpc.com',

    // len - 1:  private
    'https://rpc.ankr.com/polygon/12c187efd7ef6e437a404f3b56cd2ef24daeb506b3afc9c9691d75afc98b7183',
  ],
  [BLAST]: [
    'https://rpc.ankr.com/blast',
    'https://blast.din.dev/rpc',
    'https://blastl2-mainnet.public.blastapi.io',
    'https://blast.blockpi.network/v1/rpc/public',
    "https://rpc.blast.io",
  ],
  [BLAST_TEST]: [
    "https://sepolia.blast.io",
  ],
  [SCROLL_TEST]: [
    "https://sepolia-rpc.scroll.io",
  ],
};

export const NETWORK_METADATA = {
  [BLAST]: {
    chainId: "0x" + BLAST.toString(16),
    chainName: CHAIN_NAMES_MAP[BLAST],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[BLAST],
    blockExplorerUrls: [getExplorerUrl(BLAST)],
  },
  [BLAST_TEST]: {
    chainId: "0x" + BLAST_TEST.toString(16),
    chainName: CHAIN_NAMES_MAP[BLAST_TEST],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[BLAST_TEST],
    blockExplorerUrls: [getExplorerUrl(BLAST_TEST)],
  },
  [SCROLL_TEST]: {
    chainId: "0x" + SCROLL_TEST.toString(16),
    chainName: CHAIN_NAMES_MAP[SCROLL_TEST],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[SCROLL_TEST],
    blockExplorerUrls: [getExplorerUrl(SCROLL_TEST)],
  },
  [POLYGON]: {
    chainId: "0x" + POLYGON.toString(16),
    chainName: CHAIN_NAMES_MAP[POLYGON],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[POLYGON],
    blockExplorerUrls: [getExplorerUrl(POLYGON)],
  },
};

export const HOST_DATA = {
  [BLAST]: {
    host: "https://blastscan.io",
    hostTest: "https://testnet.blastscan.io",
  },
  [SCROLL]: {
    host: "https://scrollscan.com",
  },
  [BLAST_TEST]: {
    host: "https://testnet.blastscan.io",
  },
  [SCROLL_TEST]: {
    host: "https://sepolia.scrollscan.com",
  },
}

export function getChainName(chainId) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getExplorerUrl(chainId) {
  if (chainId === POLYGON) {
    return "https://polygonscan.com/";
  } else if (chainId === BLAST) {
    return "https://blastscan.io/";
  } else if (chainId === BLAST_TEST) {
    return "https://testnet.blastscan.io/";
  } else if (chainId === SCROLL_TEST) {
    return "https://sepolia.scrollscan.com/";
  }
  return "https://etherscan.io/";
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
export function selectChainId(netType) {
  if (IS_PROD === 'true') {
    switch (netType) {
      case BLAST_TYPE:
        return BLAST;
      case SCROLL_TYPE:
        return SCROLL;
      case ETH_TYPE:
        return ETH;
      case ETH_TEST_TYPE:
        return ETH_TEST;
      case POLYGON_TYPE:
        return POLYGON;
      default:
        return BLAST;
    }
  } else {
    switch (netType) {
      case BLAST_TYPE:
        return BLAST_TEST;
      case SCROLL_TYPE:
        return SCROLL_TEST;
      case ETH_TYPE:
        return ETH_TEST;
      case ETH_TEST_TYPE:
        return ETH_TEST;
      case POLYGON_TYPE:
        return POLYGON;
      default:
        return BLAST_TEST;
    }
  }
}
