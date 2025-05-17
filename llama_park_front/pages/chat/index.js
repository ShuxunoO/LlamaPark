import React, { useState } from "react";
import Layout from "Layout";
import VoiceButton from "components/VoiceButton";

const LlamaParkPage = () => {
  const [messageType, setMessageType] = useState("text");
  const attributes = [
    { key: "BACKGROUND", value: "Starlit" },
    { key: "HAIR", value: "Black" },
    { key: "EYES", value: "Glasses" },
    { key: "SKIN", value: "Beige" },
    { key: "CLOTHES", value: "Hawaiian Shirt" }, // Corrected spelling
    { key: "MBTI", value: "INFP" },
    { key: "SKILLS", value: "Pixel Art" },
  ];

  return (
    <Layout>
      <div className="flex flex-col p-6 min-h-screen bg-[#0052d1] text-white">
        <div className="bg-[#003a96] border-4 border-[#002764] p-5 gap-5 flex flex-col md:flex-row w-full shadow-[5px_5px_0px_#002764] h-[85vh]">
          {/* Left Column: Image and Attributes - Added overflow-y-auto */}
          <div className="flex flex-col md:w-96 gap-5 overflow-y-auto"> {/* md:w-1/2 to take half width on medium screens and up */}
            {/* Llama Image Container */}
            <div className="flex-1 bg-[#002c70] border-2 border-[#001f50] p-4 flex items-center justify-center">
              {/* Replace this with your actual Llama image component or <img> tag */}
              <div className="text-[#558ddc] text-center w-[200px] h-[200px] border-2 border-dashed border-[#558ddc] flex items-center justify-center">
                LLAMA IMAGE AREA
              </div>
            </div>

            {/* Attributes Section */}
            <div className="bg-[#002c70] border-2 border-[#001f50] p-4 mb-4 md:mb-0"> {/* Removed mb-4 for md screens as it's the last item in this column */}
              {attributes.map((attr) => (
                <div key={attr.key} className="flex justify-between mb-2 text-sm">
                  <span className="text-[#a0c8ff] uppercase">{attr.key}</span>
                  <span className="text-white">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Chat Box - Added overflow-y-auto */}
          <div className="flex flex-col flex-1 overflow-y-auto"> {/* md:w-1/2 to take half width on medium screens and up */}
            {/* Chat Box */}
            <div className="bg-[#002c70] border-2 border-[#001f50] p-4 text-sm h-full flex flex-col"> {/* Added h-full and flex flex-col to make it fill height */}
              <p className="mb-2 text-white text-right pl-6">Hello!</p>
              <p className="mb-2 text-white pr-6">What are you up to?</p>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => setMessageType(messageType === 'text' ? 'voice' : 'text')}
                  className="bg-[#001f50] border-2 border-[#001538] w-10 h-10 text-white text-lg cursor-pointer hover:text-[#a0c8ff]"
                >
                  {messageType === 'text' ? <>⌨️</> : <>🎤</>}
                </button>
                {messageType === 'voice' ? (
                  <div className="flex items-center bg-[#001f50] border-2 border-[#001538] px-2 py-1 w-full">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-grow bg-transparent border-none text-white outline-none text-sm placeholder-[#70a0ef]"
                    />
                    <button className="bg-transparent border-none text-white text-lg cursor-pointer px-1 hover:text-[#a0c8ff]">
                      {">"}
                    </button>
                  </div>
                ) : (
                  <VoiceButton />
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

export default LlamaParkPage;
