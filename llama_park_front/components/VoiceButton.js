import React from 'react';

const VoiceButton = () => {
  return (
    <button
      className="flex items-center justify-center cursor-pointer bg-[#001f50] border-2 border-[#001538] px-2 py-1 w-full text-white hover:text-[#a0c8ff] active:text-[#a0c8ff]"
    >
      <p className="text-center">Hold to talk</p>
    </button>
  );
};

export default VoiceButton;