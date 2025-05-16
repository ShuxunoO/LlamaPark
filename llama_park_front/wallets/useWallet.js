import { useAccount, useNetwork } from "wagmi";

export default function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const { chain } = useNetwork();

  return {
    active: isConnected,
    address,
    connector,
    walletType: connector?.name || '',
    chainId: chain?.id,
  };
}
