import Layout from "Layout";
import { useState, useEffect, useCallback, useMemo  } from "react";
import VoiceButton from "components/VoiceButton";
import { LlamaParkContractConfig } from "@config/constants";
import { readContract } from "@wagmi/core";
import useWallet from "@wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Router from "next/router";
import styles from "./index.module.scss";
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
import ChatItem from "components/ChatItem";
import TextChat from "components/TextChat";

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
// Mock llama data - in a real app, you would fetch this from your contract
const mockLlamas = [
  { id: 1, image: llamapark_1 },
  { id: 2, image: llamapark_2 },
  { id: 3, image: llamapark_3 },
  { id: 4, image: llamapark_4 },
  { id: 5, image: llamapark_5 },
  { id: 6, image: llamapark_6 },
  { id: 7, image: llamapark_7 },
  { id: 8, image: llamapark_8 },
  { id: 9, image: llamapark_9 },
  { id: 10, image: llamapark_10 },
  { id: 11, image: llamapark_11 },
  { id: 12, image: llamapark_12 },
  { id: 13, image: llamapark_13 },
  { id: 14, image: llamapark_14 },
  { id: 15, image: llamapark_15 },
];

const Home = () => {
  const [ownedLlamas, setOwnedLlamas] = useState([]);
  const [teamLlamas, setTeamLlamas] = useState([]);
  const { active, address } = useWallet();
  const { openConnectModal } = useConnectModal();

  const [messages, setMessages] = useState([]);
  const [messageType, setMessageType] = useState("text");

  const handleSendMessage = useCallback((message) => {
    setMessages([...messages, message]);
  }, [messages]);
  const handleEndChat = useCallback(() => {
    setMessages([]);
  }, []);
  useEffect(() => {
    if (active) {
      const fetchData = async () => {
        const tokenIds = await fetchTokenIdOfMinter(address);
        const ownedLlamas = tokenIds.map((tokenId) => {
          const llama = mockLlamas.find((l) => l.id === parseInt(tokenId));
          return llama;
        });
        setOwnedLlamas(ownedLlamas);
      };
      address && fetchData();
    } else {
      setOwnedLlamas([]);
      if (!active && openConnectModal) {
        openConnectModal();
      }
    }
  }, [address, active]);

  const handleDragStart = (e, llama) => {
    if (messages.length > 0) {
      return;   
    }
    e.dataTransfer.setData("llamaId", llama.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const llamaId = parseInt(e.dataTransfer.getData("llamaId"));
    const llama = ownedLlamas.find((l) => l.id === llamaId);
    if (llama && !teamLlamas.some((l) => l.id === llamaId)) {
      setTeamLlamas([...teamLlamas, llama]);
    }
  };

  const removeFromTeam = (llamaId) => {
    if (messages.length > 0) {
      return;   
    }
    setTeamLlamas(teamLlamas.filter((llama) => llama.id !== llamaId));
  };
  const goDetail = (llamaId) => {
    // go to chat page with llamaId as query parameter
    console.log(llamaId);
    Router.push({
      pathname: "/chat",
      query: { tokenId: llamaId },
    });
  };

  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center p-4">
        <div className="text-center mb-8">
          <h1
            className={`text-5xl font-bold text-white mb-2 ${styles.fontPixel}`}
          >
            LLAMA PARK
          </h1>
          <h2 className={`text-2xl text-white ${styles.fontPixel}`}>
            PERSONAL ASSETS
          </h2>
          <div className="w-full h-1 bg-white my-4"></div>
        </div>
        <div className="flex w-full px-10 justify-center">
          <div className="mb-8 w-[800px]">
            <div>
              <h3 className="text-3xl text-white font-pixel mb-4">
                OWNED LLAMAS
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {ownedLlamas.map((llama) => (
                  <div
                    key={llama.id}
                    className="bg-blue-600 p-2 border-4 border-white cursor-pointer"
                    draggable
                    onDragStart={(e) => handleDragStart(e, llama)}
                    onClick={() => goDetail(llama.id)}
                  >
                    <img
                      src={llama.image.src || "@images/llama_1.png"}
                      alt={llama.name}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-3xl text-white font-pixel mb-4 mt-4">
                TEAM FORMATION
              </h3>
              <div
                className="border-4 border-white border-dashed p-8 min-h-[200px] flex flex-wrap gap-4 bg-blue-600"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {teamLlamas.length === 0 ? (
                  <div
                    className={`w-full text-center text-white text-2xl font-pixel ${styles.fontPixel}`}
                  >
                    DRAG LLAMAS HERE
                  </div>
                ) : (
                  teamLlamas.map(
                    (llama) => (
                      console.log(llama),
                      (
                        <div
                          key={llama.id}
                          className="relative bg-blue-600 p-2 border-4 border-white"
                          onClick={() => removeFromTeam(llama.id)}
                        >
                          <img
                            src={llama.image.src}
                            alt={llama.name}
                            className="w-24 h-auto"
                          />
                          <div className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center cursor-pointer">
                            ×
                          </div>
                        </div>
                      )
                    )
                  )
                )}
              </div>
            </div>
          </div>
          {teamLlamas.length > 0 && <div className="flex flex-col flex-1 overflow-y-auto ml-10">
            <div className="bg-[#002c70]/70 border-2 border-[#001f50] text-sm h-full flex flex-col">
              <div
                className={`overflow-y-auto flex-1 p-4 flex flex-col gap-2 text-white ${
                  messages.length === 0 ? "justify-center" : ""
                }`}
              >
                {messages.map((message, index) => (
                  <ChatItem
                    key={index}
                    message={message}
                    NFT_ID={`Llama Park #${tokenId}`}
                  />
                ))}
                {messages.length === 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-center text-white">
                      Ask me anything about your Llama Park NFT!
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-2 px-4 pb-4">
                {/* <button
                  onClick={() => setMessageType(messageType === 'text' ? 'voice' : 'text')}
                  className="bg-[#001f50] border-2 border-[#001538] w-10 h-10 text-white text-lg cursor-pointer hover:text-[#a0c8ff]"
                >
                  {messageType === 'text' ? <>🎤</> : <>⌨️</>}
                </button> */}
                {messageType === "voice" ? (
                  <VoiceButton />
                ) : (
                  <TextChat onSendMessage={handleSendMessage} />
                )}
                {messages.length > 0 && (
                  <button
                    className="bg-[#001f50] border-2 border-[#001538] w-10 h-10 text-center text-white text-lg cursor-pointer hover:text-[#a0c8ff]"
                    title="End Chat"
                    onClick={handleEndChat}
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          </div>}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
