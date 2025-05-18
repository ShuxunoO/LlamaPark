import React, { useState, useCallback, useEffect, useMemo } from "react";
import useWallet from "@wallets/useWallet";
import { marked } from 'marked';

// Gender: Boy, Girl
export default function ChatItem({ message, NFT_ID, Gender = 'Girl' }) {
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
      setAssistant(data.message);
      // 让 ID 为 chat-new 的元素滚动到可视区域
      const chatNew = document.getElementById('chat-new');
      if (chatNew) {
        chatNew.scrollIntoView({ behavior: 'smooth' });
      }
      // Use browser's Text-to-Speech API to speak the assistant's response
      if (data.message && typeof window !== 'undefined') {
        // Cancel any ongoing speech before starting a new one
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(data.message);
        // Enhance emotional expression with voice properties
        utterance.rate = 0.9; // Slightly slower for more emotion
        utterance.volume = 1.0; // Full volume

        // Adjust pitch based on gender
        if (Gender === 'Girl') {
          utterance.pitch = 1.2; // Higher pitch for female voice
        } else {
          utterance.pitch = 0.9; // Lower pitch for male voice
        }

        // Get voices after speech synthesis is ready
        // Some browsers need time to load voices
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          // If voices aren't loaded yet, wait for them
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            if (Gender === 'Girl') {
              const femaleVoices = voices.filter(voice => voice.name.includes('female') || voice.name.includes('Female'));
              if (femaleVoices.length > 0) {
                utterance.voice = femaleVoices[0];
              }
            } else {
              const maleVoices = voices.filter(voice => voice.name.includes('male') || voice.name.includes('Male'));
              if (maleVoices.length > 0) {
                utterance.voice = maleVoices[0];
              }
            }
            window.speechSynthesis.speak(utterance);
          };
        } else {
          // Voices are already loaded
          if (Gender === 'Girl') {
            const femaleVoices = voices.filter(voice => voice.name.includes('female') || voice.name.includes('Female'));
            if (femaleVoices.length > 0) {
              utterance.voice = femaleVoices[0];
            }
          } else {
            const maleVoices = voices.filter(voice => voice.name.includes('male') || voice.name.includes('Male'));
            if (maleVoices.length > 0) {
              utterance.voice = maleVoices[0];
            }
          }
          window.speechSynthesis.speak(utterance);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError('Error fetching assistant');
    }
  }, [message, address, NFT_ID]);
  const htmlflow = useMemo(() => ({ __html: marked.parse(assistant) }), [assistant]);
  useEffect(() => {
    handleGetAssistant();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-right pl-6">{message}</p>
      <div className="pr-6">{loading ? 'Thinking...' : (assistant ? <article className="prose max-w-[480px]" dangerouslySetInnerHTML={htmlflow} /> : null) || error}</div>
    </div>
  );
}