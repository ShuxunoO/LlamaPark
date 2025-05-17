import Layout from "Layout";
import { useState, useEffect } from "react";
import llama1 from "@images/llama_1.png";
import { LlamaParkContractConfig } from "@config/constants";
import { readContract } from "@wagmi/core";
import { writeContract } from "@hooks/operateContract";
import useWallet from "@wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { notify } from "@utils/msgNotify";
import { Button } from "@lidofinance/lido-ui";
// It's good practice to import parseEther or similar for handling ETH values
import { parseEther } from "viem";

const Mint = () => {
  // if wallet is connected, fetch user's mint status
  const { active, address } = useWallet();
  const { openConnectModal } = useConnectModal();
  // minting state
  const [minting, setMinting] = useState(false);

  const mint = async () => {
    setMinting(true);
    try {
      // Assuming you want to mint 1 token at a time
      const mintAmountToPass = BigInt(1);

      await writeContract("mint", {
        ...LlamaParkContractConfig, // Contains address and abi
        functionName: "mint",
        args: [mintAmountToPass], // Pass the _mintAmount as an argument
        value: 0n, // Using BigInt zero for 0 ETH mint price
      });
    } catch (error) {
      // Ensure the error is a string or has a message property for notify
      const errorMessage = error instanceof Error ? error.message : String(error);
      notify(errorMessage, "error");
      console.error("Minting error:", error); // Log the full error for more details
    } finally {
      setMinting(false);
    }
  };
  const manageMint = async () => {
    if (!active) {
      openConnectModal();
      return;
    }
    await mint();
  };

  return (
    <Layout>
      <div className="w-full h-full">
        <div className="p-4 flex flex-col items-center justify-center text-xl w-full mb-16">
          <img
            src={llama1.src}
            className="mb-4 w-full aspect-square object-cover rounded-3xl md:w-1/3 lg:w-1/3 2xl:w-1/4"
          />
          <div className="flex flex-col items-center">
            <div className="text-xs text-center mb-4">Mint Price: 0 ETH. </div>
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
        </div>
      </div>
    </Layout>
  );
};

export default Mint;
