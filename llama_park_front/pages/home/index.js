import Layout from "Layout";
import { useState, useEffect } from "react";
import llamaIcon from "@icons/llama_Icon_1.png";
import { LlamaParkContractConfig } from "@config/constants";
import { readContract } from "@wagmi/core";
import { writeContract } from "@hooks/operateContract";
import useWallet from "@wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { notify } from "@utils/msgNotify";
import { Button } from "@lidofinance/lido-ui";
// It's good practice to import parseEther or similar for handling ETH values
import { parseEther } from "viem";
const useNFTData = () => {
  const [loading, setLoading] = useState(true);
  const [supply, setSupply] = useState(0);
  const fetchSupply = async () => {
    try {
      const res = await readContract({
       ...LlamaParkContractConfig, // Contains address and abi
        functionName: "totalSupply",
        args: [],
      })
      console.log("res", Number(res));
      setSupply(Number(res)); // Assuming res is the total supply valu
    } catch (error) {
      console.error("Error fetching total supply:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSupply();
  }, [fetchSupply]);

  return { loading, supply, fetchSupply }; // <-- Add fetchSupply here
}

const Mint = () => {
  // if wallet is connected, fetch user's mint status
  const { active, address } = useWallet();
  const { openConnectModal } = useConnectModal();
  // minting state
  const [minting, setMinting] = useState(false);
  const { loading, supply, fetchSupply } = useNFTData();
  const progress = Math.min(supply / 16, 1);
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
      await fetchSupply(); // <-- Refetch supply after mint
    } catch (error) {
      // Ensure the error is a string or has a message property for notify
      const errorMessage =
        error instanceof Error ? error.message : String(error);
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
          {/* Changed border-[6px] to border-4 and added ring-2 with a darker color */}
          <div className="bg-[#1c2e4a] border-4 border-[#f0e6d2] ring-2 ring-[#101a2b] p-6 md:p-8 w-auto mb-10">
            <h1 className="text-[#f0e6d2] text-4xl md:text-6xl text-center tracking-wider">
              LLAMA PARK
            </h1>
          </div>
          <div className="flex flex-col items-center bg-[#1c2e4a] w-[600px] px-30 py-10">
            {/* Pixel-style MINT title */}
            <div className="mb-4">
              <h2 className="text-[#f0e6d2] text-3xl md:text-5xl text-center tracking-widest select-none">MINT</h2>
            </div>
            {/* Pixel-art llama image */}
            <div className="mb-10">
              <img
                src={llamaIcon.src}
                className="w-40 h-40 md:w-56 md:h-56 object-contain"
                style={{imageRendering: 'pixelated'}}
                alt="llama pixel art"
              />
            </div>
            {/* Pixel progress bar */}
            <div className="w-72 h-6 flex items-center mb-8 bg-[#101a2b] border-4 border-[#1c2e4a] relative" style={{boxShadow: '2px 2px 0 #101a2b'}}>
              <div
                className="h-full bg-[#2b3e5a]"
                style={{
                  width: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 1,
                }}
              ></div>
              <div
                className="h-full bg-[#22aaff]"
                style={{
                  width: progress * 100 + '%',
                  transition: "width 2s cubic-bezier(0.4,0,0.2,1)",
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 2,
                }}
              ></div>
            </div>
            {/* Pixel-art Mint Button */}
            <button
              onClick={manageMint}
              disabled={minting}
              className="relative bg-[#22aaff] text-[#f0e6d2] text-2xl tracking-widest px-16 py-3 border-4 border-[#101a2b] select-none"
              style={{
                boxShadow: '4px 4px 0 #101a2b',
                outline: 'none',
                cursor: minting ? 'not-allowed' : 'pointer',
                letterSpacing: '0.15em'
              }}
            >
              MINT
              {/* Pixel shadow */}
              <span className="absolute left-2 top-2 w-full h-full bg-transparent border-0"></span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mint;
