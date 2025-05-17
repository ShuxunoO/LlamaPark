import React, { useState, useCallback, useMemo } from "react";
import Layout from "Layout";
import VoiceButton from "components/VoiceButton";
import TextChat from "components/TextChat";
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
import { useRouter } from "next/router";
import { nfts } from "@config/nfts";
import Image from "next/image";
import ChatItem from "components/ChatItem";

const nftImages = [
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
];

const attributes = [
  { key: "BACKGROUND", value: "Starlit" },
  { key: "HAIR", value: "Black" },
  { key: "EYES", value: "Glasses" },
  { key: "SKIN", value: "Beige" },
  { key: "CLOTHES", value: "Hawaiian Shirt" },
  { key: "MBTI", value: "INFP" },
  { key: "SKILLS", value: "Pixel Art" },
];

export default function LlamaParkPage() {
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const tokenId = router.query.tokenId;
  const [messageType, setMessageType] = useState("text");
  const handleSendMessage = useCallback((message) => {
    setMessages([...messages, message]);
  }, [messages]);
  const handleEndChat = useCallback(() => {
    setMessages([]);
  }, []);
  const llama = useMemo(() => nfts[+tokenId - 1] || nfts[0], [tokenId]);

  return (
    <Layout>
      <div className="flex flex-col p-6 text-white">
        <div className="bg-[#003a96]/50 border-4 border-[#002764] p-5 gap-5 flex flex-col md:flex-row w-full shadow-[5px_5px_0px_#002764] h-[85vh]">
          {/* Left Column: Image and Attributes - Added overflow-y-auto */}
          <div className="flex flex-col md:w-96 gap-5 overflow-y-auto"> {/* md:w-1/2 to take half width on medium screens and up */}
            {/* Llama Image Container */}
            <div className="flex-1 bg-[#002c70]/70 border-2 border-[#001f50] p-4 flex items-center justify-center">
              {/* Replace this with your actual Llama image component or <img> tag */}
              {/* <div className="text-[#558ddc] text-center w-[200px] h-[200px] border-2 border-dashed border-[#558ddc] flex items-center justify-center">
                LLAMA IMAGE AREA {tokenId && `(Token ID: ${tokenId})`}
              </div> */}
              <Image
                src={nftImages[+tokenId - 1]}
                alt="Llama"
                width="100%"
                height="100%"
                className="object-contain w-full h-full object-center"
              />
            </div>

            {/* Attributes Section */}
            <div className="bg-[#002c70]/70 border-2 border-[#001f50] p-4 mb-4 md:mb-0"> {/* Removed mb-4 for md screens as it's the last item in this column */}
              {llama.attributes.map((attr) => (
                <div key={attr.key} className="flex justify-between mb-2 text-xs">
                  <span className="text-[#a0c8ff] uppercase">{attr.trait_type}</span>
                  <span className="text-white text-right">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="bg-[#002c70]/70 border-2 border-[#001f50] text-sm h-full flex flex-col">
              <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2 text-white">
                {messages.map((message, index) => (
                  <ChatItem
                    key={index}
                    message={message}
                    NFT_ID={`Llama Park #${tokenId}`}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-2 px-4 pb-4">
                <button
                  onClick={() => setMessageType(messageType === 'text' ? 'voice' : 'text')}
                  className="bg-[#001f50] border-2 border-[#001538] w-10 h-10 text-white text-lg cursor-pointer hover:text-[#a0c8ff]"
                >
                  {messageType === 'text' ? <>🎤</> : <>⌨️</>}
                </button>
                {messageType === 'voice' ? (
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
          </div>
        </div>

        {/* <div className="text-center">
          <button className="bg-[#f5d7a2] text-[#5a3a1e] border-3 border-[#c7a778] px-8 py-3 text-lg uppercase cursor-pointer mt-8 tracking-wide shadow-[3px_3px_0px_#c7a778] active:shadow-[1px_1px_0px_#c7a778] active:translate-x-[2px] active:translate-y-[2px] hover:bg-[#e8c992]">
            SOUL BIND
          </button>
        </div> */}
      </div>
    </Layout>
  );
};
