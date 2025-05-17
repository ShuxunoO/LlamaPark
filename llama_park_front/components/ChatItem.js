import React, { useState, useCallback, useEffect } from "react";
import useWallet from "@wallets/useWallet";

export default function ChatItem({ message, NFT_ID }) {
  const { address } = useWallet();
  const [loading, setLoading] = useState(true);
  const [assistant, setAssistant] = useState('');
  const [error, setError] = useState('');
  const handleGetAssistant = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://u447134-832d-a5ee786a.bjc1.seetacloud.com:8443/api/llamachat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          user_addr: address,
          NFT_ID,
        }),
      });
      const data = await response.json();
      setAssistant(data.assistant);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError('Error fetching assistant');
    }
  }, [message, address, NFT_ID]);
  useEffect(() => {
    handleGetAssistant();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-right pl-6">{message}</p>
      <p className="pr-6">{loading ? 'Thinking...' : assistant || error}</p>
    </div>
  );
}