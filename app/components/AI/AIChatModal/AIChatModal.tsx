"use client"
import React, { useState } from 'react';
 
import styles from './AIChatModal.module.scss';
 
import { MessageCircle, Send, X } from 'lucide-react';

type AIChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = () => {
    if (userInput.trim()) {
      // TODO: Add message sending logic
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

        <div className={styles.messages}>
          {/* Messages will be displayed here */}
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
              disabled={!userInput.trim()}
              className={styles.sendButton}
            >
              <Send className={styles.sendButtonIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};