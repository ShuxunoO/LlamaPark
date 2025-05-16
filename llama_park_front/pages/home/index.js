import Layout from "Layout";
import { useState, useEffect } from "react";
import llama1 from "@images/llama_1.png";
import { LlamaParkContractConfig } from "@config/constants";
import { readContract } from "@wagmi/core";
import { writeContract } from "@hooks/operateContract";
import useWallet from "@wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { utils } from "ethers";
import { notify } from "@utils/msgNotify";
import { Button } from "@lidofinance/lido-ui";
import MintModal from "./MintModal";

const useContractData = (address, active) => {
  const [hasMinted, setHasMinted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [salePrice, setSalePrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const fetchSalePrice = async () => {
    try {
      const res = await readContract({
        ...LlamaParkContractConfig,
        functionName: "SalePrice",
        args: [],
      });
      setSalePrice(res);
    } catch (error) {
      console.error("Error fetching sale price:", error);
    }
  };

  const fetchDiscountAmount = async () => {
    try {
      const res = await readContract({
        ...LlamaParkContractConfig,
        functionName: "DiscountAmount",
        args: [],
      });
      setDiscountAmount(res);
    } catch (error) {
      console.error("Error fetching discount amount:", error);
    }
  };

  const checkHasMinted = async () => {
    try {
      const res = await readContract({
        ...LlamaParkContractConfig,
        functionName: "tokenIdOfMinter",
        args: [address],
      });
      setHasMinted(res.toString() !== "0");
    } catch (error) {
      console.error("Error fetching tokenIdOfMinter:", error);
    }
  };

  const fetchPaused = async () => {
    try {
      const res = await readContract({
        ...LlamaParkContractConfig,
        functionName: "paused",
        args: [],
      });
      setIsPaused(res);
    } catch (error) {
      console.error("Error fetching paused:", error);
    }
  };

  useEffect(() => {
    if (active) {
      // check if user has minted
      checkHasMinted();
      // check if mint is paused
      fetchPaused();
      // fetch sale price
      fetchSalePrice();
      // fetch discount amount
      fetchDiscountAmount();
    }
  }, [address, active]);

  return {
    hasMinted,
    salePrice,
    discountAmount,
    isPaused,
  };
};

const Mint = () => {
  // if wallet is connected, fetch user's mint status
  const { active, address } = useWallet();
  const { openConnectModal } = useConnectModal();
  // minting state
  const [minting, setMinting] = useState(false);
  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // contract data
  const { hasMinted, salePrice, isPaused, discountAmount } =
    useContractData(address, active);
  // discountPrice is salePrice - discountAmount
  const discountPrice = BigInt(salePrice) - BigInt(discountAmount);
  // display price by eth
  const displayPrice = utils.formatEther(salePrice);
  const displayDiscountPrice = utils.formatEther(discountPrice);

  const mint = async (address) => {
    setMinting(true);
    const actualPrice =
      address && address !== "0x0000000000000000000000000000000000000000"
        ? discountPrice // 90% of price
        : salePrice;
    const addressParam =
      address || "0x0000000000000000000000000000000000000000";
    try {
      await writeContract("mint", {
        ...LlamaParkContractConfig,
        functionName: "mint",
        args: [addressParam],
        value: actualPrice,
      });
    } catch (error) {
      notify(error, "error");
    } finally {
      setMinting(false);
    }
  };
  const manageMint = () => {
    if (!active) {
      openConnectModal();
      return;
    }
    if (hasMinted) {
      notify("You have already minted", "info");
      return;
    }
    // show mint modal
    setIsModalOpen(true);
  };

  const handleMint = async (inviterAddress) => {
    if (!active) {
      openConnectModal();
      return;
    }
    setIsModalOpen(false);
    if (hasMinted) {
      notify("You have already minted", "info");
      return;
    }
    if (isPaused) {
      notify("Mint is paused", "info");
      return;
    } else {
      await mint(inviterAddress);
    }
  };

  return (
    <Layout>
      <div className="w-full h-full">
        <div className="p-4 flex flex-col items-center justify-center text-xl w-full mb-16">
          <img
            src={llama1.src}
            className="mb-4 w-full aspect-square object-cover rounded-3xl md:w-1/3 lg:w-1/3 2xl:w-1/4"
          />
          {isPaused ? (
            <div>Mint coming soon !</div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-xs text-center mb-4">{`Mint Price: ${displayPrice} ETH. Use the invitation code to get a discounted price: ${displayDiscountPrice} ETH.`}</div>
              <Button
                color="primary"
                size="sm"
                variant="filled"
                onClick={manageMint}
                loading={minting}
              >
                Mint
              </Button>
            </div>
          )}
        </div>
      </div>
      <MintModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMint={handleMint}
      />
    </Layout>
  );
};

export default Mint;
