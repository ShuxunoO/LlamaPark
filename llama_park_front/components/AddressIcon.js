import { Identicon } from '@lidofinance/lido-ui';
import { readContract } from '@wagmi/core'
import { useEffect, useState } from 'react';
import { LlamaParkContractConfig } from "@config/constants";
import axios from "axios";
import llamapark_1 from "@images/1.png";
import llamapark_2 from "@images/2.png";
import llamapark_3 from "@images/3.png";
import llamapark_4 from "@images/4.png";
import llamapark_5 from "@images/5.png";
import llamapark_6 from "@images/6.png";
import llamapark_7 from "@images/7.png";
import llamapark_8 from "@images/8.png";
import llamapark_9 from "@images/9.png";
import llamapark_10 from "@images/10.png";
import llamapark_11 from "@images/11.png";
import llamapark_12 from "@images/12.png";
import llamapark_13 from "@images/13.png";
import llamapark_14 from "@images/14.png";
import llamapark_15 from "@images/15.png";

const images = [
  llamapark_1,
  llamapark_2,
  llamapark_3,
  llamapark_4,
  llamapark_5,
  llamapark_6,
  llamapark_7,
  llamapark_8,
  llamapark_9,
  llamapark_10,
  llamapark_11,
  llamapark_12,
  llamapark_13,
  llamapark_14,
  llamapark_15,
]


const fetchTokenIdOfMinter = async (address) => {
  try {
    const res = await readContract({
      ...LlamaParkContractConfig,
      functionName: "walletOfOwner",
      args: [address],
    });
    return res;
  } catch (error) {
    console.log("no token");
    return null;
  }
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
    console.log("tokenId", Number(tokenId[0]));
    if (!tokenId || tokenId.toString() === "0") {
      return null;
    }
    return Number(tokenId[0]) - 1;
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const fetchData = async () => {
      const nftId = await fetchNFT(address);
      if (nftId > -1) {
        setMintedNft(images[nftId])
      } else {
        setMintedNft({})
      }
    };
    address && fetchData();
  }, [address, isMounted]);

  // 服务器端渲染时，始终返回Identicon
  if (!isMounted) {
    return (
      <div>
        <Identicon address={address ?? ''} />
      </div>
    );
  }

  return (
    <div>
      {
        mintedNft?.src ? <img
        src={mintedNft.src}
        alt={mintedNft.src ? mintedNft.tokenId : "failed to get nft image"}
        className="rounded-full w-8 h-8"
      /> : <Identicon address={address ?? ''} />
      }
    </div>
  );
}