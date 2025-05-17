import React, { useState, useCallback, useEffect } from 'react';

const VoiceButton = ({ onSendMessage = () => { } }) => {
  const [isListening, setIsListening] = useState(false);
  const handleStartListening = useCallback(() => {
    if (isListening) return; // 防止重复启动
    setIsListening(true);
    console.log('start listening');
    const recognition = new window.webkitSpeechRecognition();
    
    // 设置语音识别为自动检测语言（包括中文和英文）
    // recognition.lang = 'auto';
    // 可选：如果 auto 不工作，可以尝试设置为同时支持中英文的值
    recognition.lang = 'cmn-Hans-CN, en-US';
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      console.log('result', event.results);
      const transcript = event.results[0][0].transcript;
      onSendMessage(transcript);
    };
    recognition.onend = () => {
      setIsListening(false);
      console.log('recognition ended');
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    recognition.start();
  }, [isListening, onSendMessage]);
  
  const handleStopListening = useCallback(() => {
    setIsListening(false);
    console.log('stop listening');
  }, []);
  
  // 全局监听空格键
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 只有当按键是空格且当前不在输入框中时才触发
      if (event.key === ' ' && 
          !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        // 防止空格键的默认行为（如页面滚动）
        event.preventDefault();
        if (!isListening) {
          handleStartListening();
        }
      }
    };
    
    const handleKeyUp = (event) => {
      if (event.key === ' ' && isListening) {
        handleStopListening();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isListening, handleStartListening, handleStopListening]);

  return (
    <button
      className={`flex items-center justify-center cursor-pointer bg-[#001f50] border-2 border-[#001538] px-2 py-1 w-full text-white hover:text-[#a0c8ff] active:text-[#a0c8ff] ${isListening ? 'bg-[#001f50]' : 'bg-[#001f50]'}`}
      onMouseDown={handleStartListening}
      onMouseUp={handleStopListening}
      onMouseLeave={handleStopListening}
    >
      <p className="text-center">{isListening ? 'Listening...' : 'Hold space to talk'}</p>
    </button>
  );
};

export default VoiceButton;