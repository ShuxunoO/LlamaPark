import React from "react";
import Layout from "Layout"; // Assuming Layout is in /Users/murphyyue/projects/web3/LlamaPark/llama_park_front/Layout/index.js

// --- Component ---

const LlamaParkPage = () => {
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
      {/* Main blue background */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0052d1] p-5 text-white">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl text-white uppercase mb-5 tracking-wide">
          LLAMA PARK
        </h1>

        {/* Profile Card */}
        <div className="bg-[#003a96] border-4 border-[#002764] p-5 flex flex-col md:flex-row w-full max-w-4xl shadow-[5px_5px_0px_#002764]">
          {/* Llama Image Container */}
          <div className="flex-1 md:mr-5 mb-5 md:mb-0 bg-[#002c70] border-2 border-[#001f50] p-4 flex items-center justify-center">
            {/* Replace this with your actual Llama image component or <img> tag */}
            <div className="text-[#558ddc] text-center w-[150px] h-[200px] border-2 border-dashed border-[#558ddc] flex items-center justify-center">
              LLAMA IMAGE AREA
            </div>
          </div>

          {/* Info Container */}
          <div className="flex-1.5 flex flex-col">
            {/* Attributes Section */}
            <div className="bg-[#002c70] border-2 border-[#001f50] p-4 mb-4">
              {attributes.map((attr) => (
                <div key={attr.key} className="flex justify-between mb-2 text-sm">
                  <span className="text-[#a0c8ff] uppercase">{attr.key}</span>
                  <span className="text-white">{attr.value}</span>
                </div>
              ))}
            </div>

            {/* Chat Box */}
            <div className="bg-[#002c70] border-2 border-[#001f50] p-4 text-sm">
              <p className="mb-2 text-white">Hello!</p>
              <p className="mb-2 text-white">What are you up to?</p>
              {/* Message Input Container */}
              <div className="flex items-center bg-[#001f50] border-2 border-[#001538] px-2 py-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow bg-transparent border-none text-white outline-none text-sm placeholder-[#70a0ef]"
                />
                <button className="bg-transparent border-none text-white text-lg cursor-pointer px-1 hover:text-[#a0c8ff]">
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Soul Bind Button */}
        <button className="bg-[#f5d7a2] text-[#5a3a1e] border-3 border-[#c7a778] px-8 py-3 text-lg uppercase cursor-pointer mt-8 tracking-wide shadow-[3px_3px_0px_#c7a778] active:shadow-[1px_1px_0px_#c7a778] active:translate-x-[2px] active:translate-y-[2px] hover:bg-[#e8c992]">
          SOUL BIND
        </button>
      </div>
    </Layout>
  );
};

export default LlamaParkPage;
