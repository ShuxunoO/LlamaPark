import React, { useState } from 'react';

const TextChat = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex items-center bg-[#001f50] border-2 border-[#001538] px-2 py-1 w-full">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        className="flex-grow bg-transparent border-none text-white outline-none text-sm placeholder-[#70a0ef]"
      />
      <button
        className="bg-transparent border-none text-white text-lg cursor-pointer px-1 hover:text-[#a0c8ff]"
        onClick={handleSendMessage}
      >
        {">"}
      </button>
    </div>
  );
};

export default TextChat;