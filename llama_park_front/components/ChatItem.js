import React, { useState, useCallback, useEffect } from "react";
import useWallet from "@wallets/useWallet";

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
        
        // Function to handle long text by splitting it into chunks
        const speakLongText = (text, voice) => {
          // Split text into manageable chunks (around 200 characters)
          const maxChunkLength = 200;
          const textChunks = [];
          
          for (let i = 0; i < text.length; i += maxChunkLength) {
            // Find a good breaking point (space, period, etc.)
            let endIndex = Math.min(i + maxChunkLength, text.length);
            if (endIndex < text.length) {
              // Try to find a natural break point
              const nextSpace = text.indexOf(' ', endIndex);
              const nextPeriod = text.indexOf('.', endIndex);
              const nextComma = text.indexOf(',', endIndex);
              
              if (nextPeriod > -1 && nextPeriod < nextSpace) {
                endIndex = nextPeriod + 1;
              } else if (nextComma > -1 && nextComma < nextSpace) {
                endIndex = nextComma + 1;
              } else if (nextSpace > -1) {
                endIndex = nextSpace;
              }
            }
            
            textChunks.push(text.substring(i, endIndex));
          }
          
          // Speak each chunk sequentially
          let chunkIndex = 0;
          
          const speakNextChunk = () => {
            if (chunkIndex < textChunks.length) {
              const chunkUtterance = new SpeechSynthesisUtterance(textChunks[chunkIndex]);
              chunkUtterance.voice = voice;
              chunkUtterance.rate = 0.9;
              chunkUtterance.volume = 1.0;
              chunkUtterance.pitch = Gender === 'Girl' ? 1.2 : 0.9;
              
              chunkUtterance.onend = () => {
                chunkIndex++;
                speakNextChunk();
              };
              
              window.speechSynthesis.speak(chunkUtterance);
            }
          };
          
          speakNextChunk();
        };
        
        const setupVoiceAndSpeak = () => {
          let selectedVoice = null;
          
          if (Gender === 'Girl') {
            const femaleVoices = voices.filter(voice => voice.name.includes('female') || voice.name.includes('Female'));
            if (femaleVoices.length > 0) {
              selectedVoice = femaleVoices[0];
              utterance.voice = selectedVoice;
            }
          } else {
            const maleVoices = voices.filter(voice => voice.name.includes('male') || voice.name.includes('Male'));
            if (maleVoices.length > 0) {
              selectedVoice = maleVoices[0];
              utterance.voice = selectedVoice;
            }
          }
          
          // Use the chunking method for long text
          if (data.message.length > 150) {
            speakLongText(data.message, selectedVoice);
          } else {
            window.speechSynthesis.speak(utterance);
          }
        };
        
        if (voices.length === 0) {
          // If voices aren't loaded yet, wait for them
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            setupVoiceAndSpeak();
          };
        } else {
          // Voices are already loaded
          setupVoiceAndSpeak();
        }
      }
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