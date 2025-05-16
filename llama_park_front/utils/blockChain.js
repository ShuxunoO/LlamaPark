import { NETWORK_METADATA } from "@config/chains";

export const addNetwork = async (chainId) => {
  const metadata = NETWORK_METADATA[chainId]
  await window.ethereum.request({ method: "wallet_addEthereumChain", params: [metadata] }).catch();
};

export const switchNetwork = async (chainId) => {
  try {
    const chainIdHex = "0x" + chainId.toString(16);
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    return true;
  } catch (err) {
    if (err.code !== 4001) {
      return await addNetwork(chainId);
    }
  }
};

/**
 * 
 * @param {{address: string, symbol: string, decimals: number, imageUrl?: string }} token 
 */
export async function addTokenToMetamask(token) {
  try {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.imageUrl,
        },
      },
    });
    if (wasAdded) {
      // https://github.com/MetaMask/metamask-extension/issues/11377
      // We can show a toast message when the token is added to metamask but because of the bug we can't. Once the bug is fixed we can show a toast message.
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}