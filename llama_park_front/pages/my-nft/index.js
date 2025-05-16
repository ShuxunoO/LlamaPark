import { useState, useEffect, useCallback, useMemo } from "react";
import { LlamaParkContractConfig } from "@config/constants";
import { readContract } from "@wagmi/core";
import useWallet from "@wallets/useWallet";
import { ethers, utils } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import Layout from "Layout";
import { Loader } from "@lidofinance/lido-ui";
import { useRouter } from "next/router";

const useNFTData = (address) => {
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const router = useRouter();
  const fetchTokenOfOwnerByIndex = useCallback(
    async (index) => {
      try {
        const res = await readContract({
          ...LlamaParkContractConfig,
          functionName: "tokenOfOwnerByIndex",
          args: [address, ethers.BigNumber.from(index)],
        });
        return res;
      } catch (error) {
        console.error("Error fetching tokenOfOwnerByIndex:", error);
        return null;
      }
    },
    [address]
  );

  const fetchTokenURI = useCallback(async (tokenId) => {
    try {
      const res = await readContract({
        ...LlamaParkContractConfig,
        functionName: "tokenURI",
        args: [tokenId],
      });
      return res;
    } catch (error) {
      console.error("Error fetching tokenURI:", error);
      return null;
    }
  }, []);

  const fetchImage = useCallback(async (ipfsUri) => {
    try {
      const ipfsGateway =
        "https://violet-cheerful-starfish-646.mypinata.cloud/ipfs/";
      const ipfsHash = ipfsUri.replace("ipfs://", "");
      const url = `${ipfsHash}`;
      const { data } = await axios.get(url);
      const image = data.image.replace("ipfs://", ipfsGateway);
      return image;
    } catch (error) {
      console.error("Failed to fetch image:", error);
      return null;
    }
  }, []);

  const fetchNFTByIndex = useCallback(
    async (index) => {
      try {
        const tokenId = await fetchTokenOfOwnerByIndex(index);
        if (!tokenId) return null;

        const tokenURI = await fetchTokenURI(tokenId);
        if (!tokenURI) return null;

        const imageUrl = await fetchImage(tokenURI);
        // if (!imageUrl) return null;

        return { tokenId, imageUrl };
      } catch (error) {
        console.error("Error fetching NFT details:", error);
        return null;
      }
    },
    [fetchTokenOfOwnerByIndex, fetchTokenURI, fetchImage]
  );

  const fetchNFTDetails = useCallback(async () => {
    if (!address) return;

    try {
      const balance = await readContract({
        ...LlamaParkContractConfig,
        functionName: "balanceOf",
        args: [address],
      });
      const nftPromises = Array.from({ length: Number(balance) }, (_, i) =>
        fetchNFTByIndex(i)
      );
      const nftDetails = await Promise.all(nftPromises);
      setNfts(nftDetails.filter(Boolean));
      setLoading(false);
      if (Number(balance) === 0) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setLoading(false);
    }
  }, [address, fetchNFTByIndex]);

  useEffect(() => {
    fetchNFTDetails();
  }, [fetchNFTDetails]);

  return { loading, nfts };
};

const NFTDetailPage = () => {
  const { active, address } = useWallet();
  const { openConnectModal } = useConnectModal();
  const { loading, nfts } = useNFTData(address);
  useEffect(() => {
    if (!active) {
      openConnectModal();
    }
  }, [active, openConnectModal]);
  // modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // disable scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isModalOpen]);
  return (
    <Layout>
      <div className="w-screen px-4 sm:px-8 lg:px-16 pt-4">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nfts.map((nft, index) => (
              <div key={index} className="text-center text-xl">
                <img
                  src={nft.imageUrl}
                  alt={nft.imageUrl ? nft.tokenId : "failed to get nft image"}
                  className="mb-4 w-full aspect-square object-cover rounded-3xl cursor-pointer"
                  onClick={() => nft.imageUrl && setIsModalOpen(true)}
                />
                <p>Token ID: {nft.tokenId.toString()}</p>
                {isModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <img
                      src={nft.imageUrl}
                      alt="Full Project Image"
                      className="max-w-full max-h-full object-contain cursor-pointer"
                      onClick={() => setIsModalOpen(false)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-xl mt-10">No NFTs found</div>
        )}
      </div>
    </Layout>
  );
};

export default NFTDetailPage;
