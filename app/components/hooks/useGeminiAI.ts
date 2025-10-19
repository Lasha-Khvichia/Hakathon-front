 
import { useState } from 'react';
import { callGeminiAPI } from '../services/geminiAPI.';

type ChatMessage = {
  role: string;
  text: string;
};

export const useGeminiAI = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const saveApiKey = () => {
    if (geminiApiKey.trim()) {
      setShowApiKeyInput(false);
      setChatMessages([{
        role: 'ai',
        text: 'Hello! 👋 I\'m your AI assistant. I can help you understand our services, choose the right option, or answer any questions about the booking process. How can I help you today?'
      }]);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', text: message };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsAITyping(true);

    try {
      const aiResponse = await callGeminiAPI(message, geminiApiKey);
      const newAIMessage: ChatMessage = { role: 'ai', text: String(aiResponse) };
      setChatMessages(prev => [...prev, newAIMessage]);
    } catch {
      const errorMessage: ChatMessage = { 
        role: 'ai', 
        text: 'Sorry, there was an error connecting to the AI assistant. Please check your API key.' 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAITyping(false);
    }
  };

  return {
    chatMessages,
    isAITyping,
    geminiApiKey,
    showApiKeyInput,
    setGeminiApiKey,
    saveApiKey,
    sendMessage
  };
};