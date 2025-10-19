"use client"
import React, { useState } from 'react';
 
import { useGeminiAI } from '../../hooks/useGeminiAI';
 
import styles from './AIChatModal.module.scss';
 
import { ApiKeySetup } from '../ApiKeySetup/ApiKeySetup';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { MessageCircle, Send, X } from 'lucide-react';

type AIChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const {
    chatMessages,
    isAITyping,
    geminiApiKey,
    showApiKeyInput,
    setGeminiApiKey,
    saveApiKey,
    sendMessage
  } = useGeminiAI();

  const handleSendMessage = () => {
    if (userInput.trim()) {
      sendMessage(userInput);
      setUserInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.aiChatModal}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <MessageCircle className={styles.headerIcon} />
            <h3 className={styles.headerTitle}>AI Assistant</h3>
          </div>
          <button onClick={onClose} className={styles.headerClose}>
            <X className={styles.headerIcon} />
          </button>
        </div>

        {showApiKeyInput ? (
          <ApiKeySetup 
            apiKey={geminiApiKey}
            setApiKey={setGeminiApiKey}
            onSave={saveApiKey}
          />
        ) : (
          <>
            <div className={styles.messages}>
              {chatMessages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  message={msg.text} 
                  role={msg.role as 'user' | 'assistant'}
                />
              ))}
              {isAITyping && (
                <div className={styles.typing}>
                  <div className={styles.typingBubble}>
                    <div className={styles.typingDots}>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className={styles.input}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isAITyping}
                  className={styles.sendButton}
                >
                  <Send className={styles.sendButtonIcon} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};