import { Identicon } from '@lidofinance/lido-ui';
import { readContract } from '@wagmi/core'
import { useEffect, useState } from 'react';
import { LlamaParkContractConfig } from "@config/constants";
import axios from "axios";


const fetchTokenIdOfMinter = async (address) => {
  try {
    const res = await readContract({
      ...LlamaParkContractConfig,
      functionName: "tokenIdOfMinter",
      args: [address],
    });
    return res;
  } catch (error) {
    console.log("no token");
    return null;
  }
};

const fetchTokenURI = async (tokenId) => {
  const res = await readContract({
    ...LlamaParkContractConfig,
    functionName: "tokenURI",
    args: [tokenId],
  });
  return res;
};

const fetchImage = async (ipfsUri) => {
  try {
    const ipfsGateway = "https://violet-cheerful-starfish-646.mypinata.cloud/ipfs/";
    const ipfsHash = ipfsUri.replace("ipfs://", "");
    const url = `${ipfsHash}`;
    const { data } = await axios.get(url);
    const image = data.image.replace("ipfs://", ipfsGateway);
    console.log(image)
    return image;
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return null;
  }
};

const fetchNFT = async (address) => {
  try {
    const tokenId = await fetchTokenIdOfMinter(address);
    if (!tokenId || tokenId.toString() === "0") {
      return null;
    }
    const tokenURI = await fetchTokenURI(tokenId);
    const imageUrl = await fetchImage(tokenURI);
    return { tokenId, imageUrl };
  } catch (error) {
    console.error("Error fetching NFT details:", error);
    return null;
  }
};
// determine whether the current address's user is an minter.
const minterValidate = async (address) => {
  try {
    const res = await readContract({
      ...LlamaParkContractConfig,
      functionName: "haveMinted",
      args: [address],
    });
    console.log("minter", res);
    return res;
  } catch (error) {
    // notify("You are not minter", "error");
    console.error("Error haveMinted:", error);
    return false;
  }
};
export default function AddressIcon({ address }) {
  if (!address) return null;
  const [mintedNft, setMintedNft] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const isMinter = await minterValidate(address);
        if (isMinter) {
          const nft = await fetchNFT(address);
          console.log(nft)
          nft && setMintedNft(nft);
        }
      } catch (error) {} finally {
        
      }
    };
    address && fetchData();
  }, [address]);
  return (
    <div>
      {
        mintedNft?.imageUrl && mintedNft?.tokenId ? <img
        src={mintedNft.imageUrl}
        alt={mintedNft.imageUrl ? mintedNft.tokenId : "failed to get nft image"}
        className="rounded-full w-8 h-8"
      /> : <Identicon address={address ?? ''} />
      }
    </div>
  );
}