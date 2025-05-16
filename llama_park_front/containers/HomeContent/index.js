import HomeBg1 from "@images/ether_1.jpg";
import HomeBg2 from "@images/ether_2.jpg";
import HomeBg3 from "@images/ether_3.jpg";
import HomeBg4 from "@images/ether_4.png";
import { useState, useEffect } from "react";
import { readContract } from "@wagmi/core";
import { LlamaParkContractConfig } from "@config/constants";

const Home = () => {
  const [isPaused, setIsPaused] = useState(false);
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
    // check if mint is paused
    fetchPaused();
  }, []);
  return (
    <>
      <div
        className="px-4 sm:px-8 lg:px-16 overflow-y-auto"
        style={{ height: "calc(100vh - 152px)" }}
      >
        <main>
          <div className="w-full text-center text-4xl font-semibold py-4">
            {isPaused ? "Mint coming soon!" : null}
          </div>
          <div>
            <div className="flex flex-col md:flex-row md:even:flex-row-reverse">
              <div className="w-full md:max-w-[30%]">
                <h3 className="text-2xl md:text-4xl font-semibold text-center md:text-left md:mt-12">
                  Strongest Consensus:
                </h3>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-center md:text-left">
                  Bigger! Stronger!
                </p>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-center md:text-left">
                  Let's talk about ETH market value!
                </p>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-center md:text-left">
                  Check out Vitalik Buterin's AI Immortal Virtual Human!
                </p>
              </div>
              <div className="rounded-3xl w-full mb-4 sm:mb-10 overflow-hidden relative">
                <img src={HomeBg4.src} className="w-full object-cover z-[1]" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:even:flex-row-reverse">
              <div className="w-full md:max-w-[30%] ml-0 md:ml-4">
                <h3 className="text-2xl md:text-4xl font-semibold text-center md:text-left md:mt-12">
                  Win-Win:
                </h3>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-left">
                  ERC721-C: Minters earn 3% royalties on every transaction.
                </p>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-left">
                  Get a random Token ID.
                </p>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-left">
                  One token per address.
                </p>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-left">
                  Creators, Minters, Inviters, and Traders all share equal rights.
                </p>
              </div>
              <div className="rounded-3xl w-full mb-4 sm:mb-10 overflow-hidden relative">
                <img src={HomeBg1.src} className="w-full object-cover z-[1]" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:even:flex-row-reverse">
              <div className="w-full md:max-w-[30%] ml-0 md:ml-4">
                <h3 className="text-2xl md:text-4xl font-semibold text-center md:text-left md:mt-12">
                  Meme Token:
                </h3>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-left">
                  Build the strongest consensus and reach the biggest market cap.
                </p>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-left">
                  Distribute Meme tokens to creators, minters, inviters, and traders.
                </p>
              </div>
              <div className="rounded-3xl w-full mb-4 sm:mb-10 overflow-hidden relative">
                <img src={HomeBg2.src} className="w-full object-cover z-[1]" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:even:flex-row-reverse">
              <div className="w-full md:max-w-[30%] ml-0 md:ml-4">
                <h3 className="text-2xl md:text-4xl font-semibold text-center md:text-left md:mt-12">
                  Together:
                </h3>
                <p className="text-base md:text-2xl md:mt-10 mb-2 leading-relaxed text-gray-700 text-left">
                  Let's supercharge the Ethereum ecosystem for even more growth and innovation!
                </p>
              </div>
              <div className="rounded-3xl w-full mb-4 sm:mb-10 overflow-hidden relative">
                <img src={HomeBg3.src} className="w-full object-cover z-[1]" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
