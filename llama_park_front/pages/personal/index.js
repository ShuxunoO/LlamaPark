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
import styles from "./index.module.scss"; 

const Home = () => {
  const [ownedLlamas, setOwnedLlamas] = useState([]);
  const [teamLlamas, setTeamLlamas] = useState([]);
  const { address, isConnected } = useWallet();
  const { openConnectModal } = useConnectModal();

  // Mock llama data - in a real app, you would fetch this from your contract
  const mockLlamas = [
    { id: 1, name: "Basic Llama", image: "@images/llama_1.png", color: "beige" },
    { id: 2, name: "Cool Llama", image: "/images/llama_2.png", color: "purple", accessory: "sunglasses" },
    { id: 3, name: "Brown Llama", image: "/images/llama_3.png", color: "brown" },
    { id: 4, name: "Fancy Llama", image: "/images/llama_4.png", color: "white", accessory: "hat" },
    { id: 5, name: "Smoker Llama", image: "/images/llama_5.png", color: "gray", accessory: "pipe" },
    { id: 6, name: "Golden Llama", image: "/images/llama_6.png", color: "gold" },
    { id: 7, name: "Captain Llama", image: "/images/llama_7.png", color: "cream", accessory: "hat" },
    { id: 8, name: "Red Llama", image: "/images/llama_8.png", color: "red" },
  ];

  useEffect(() => {
    // In a real app, you would fetch the user's NFTs from the contract
    if (isConnected) {
      setOwnedLlamas(mockLlamas);
    } else {
      setOwnedLlamas([]);
    }
  }, [isConnected]);

  const handleDragStart = (e, llama) => {
    e.dataTransfer.setData("llamaId", llama.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const llamaId = parseInt(e.dataTransfer.getData("llamaId"));
    const llama = ownedLlamas.find(l => l.id === llamaId);
    
    if (llama && !teamLlamas.some(l => l.id === llamaId)) {
      setTeamLlamas([...teamLlamas, llama]);
    }
  };

  const removeFromTeam = (llamaId) => {
    setTeamLlamas(teamLlamas.filter(llama => llama.id !== llamaId));
  };

  const connectWallet = () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center p-4 bg-blue-500">
        <div className="text-center mb-8">
        <h1 className={`text-5xl font-bold text-white mb-2 ${styles.fontPixel}`}>LLAMA PARK</h1>
        <h2 className={`text-2xl text-white ${styles.fontPixel}`}>PERSONAL ASSETS</h2>
          <div className="w-full h-1 bg-white my-4"></div>
        </div>

        {(
          <>
            <div className="mb-8">
              <h3 className="text-3xl text-white font-pixel mb-4">OWNED LLAMAS</h3>
              <div className="grid grid-cols-4 gap-4">
                {ownedLlamas.map(llama => (
                  <div 
                    key={llama.id}
                    className="bg-blue-600 p-2 border-4 border-white cursor-pointer"
                    draggable
                    onDragStart={(e) => handleDragStart(e, llama)}
                  >
                    <img 
                      src={llama.image || "@images/llama_1.png"} 
                      alt={llama.name}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl text-white font-pixel mb-4">TEAM FORMATION</h3>
              <div 
                className="border-4 border-white border-dashed p-8 min-h-[200px] flex flex-wrap gap-4 bg-blue-600"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {teamLlamas.length === 0 ? (
                  <div className={`w-full text-center text-white text-2xl font-pixel ${styles.fontPixel}`}>
                    DRAG LLAMAS HERE
                  </div>
                ) : (
                  teamLlamas.map(llama => (
                    <div 
                      key={llama.id} 
                      className="relative bg-blue-600 p-2 border-4 border-white"
                      onClick={() => removeFromTeam(llama.id)}
                    >
                      <img 
                        src={llama1.src} 
                        alt={llama.name}
                        className="w-24 h-auto"
                      />
                      <div className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center cursor-pointer">
                        ×
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
