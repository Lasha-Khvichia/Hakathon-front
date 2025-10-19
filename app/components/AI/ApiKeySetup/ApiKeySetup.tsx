"use client"
import React from 'react';
import styles from './ApiKeySetup.module.scss';
import { MessageCircle } from 'lucide-react';

interface Props {
  apiKey: string;
  setApiKey: (value: string) => void;
  onSave: () => void;
}

export const ApiKeySetup = ({ apiKey, setApiKey, onSave }: Props) => {
  return (
    <div className={styles.apiKeySetup}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <MessageCircle className={styles.icon} />
          </div>
          <h3 className={styles.title}>Setup Gemini AI</h3>
          <p className={styles.description}>Enter your Gemini API key to start chatting</p>
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Get API Key →
          </a>
        </div>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && onSave()}
        />
        <button
          onClick={onSave}
          className={styles.button}
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
};