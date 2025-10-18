"use client"
import React from 'react';
import styles from './ChatMessage.module.scss';

interface ChatMessageProps {
  message: string;
  role: 'user' | 'assistant';
}

export const ChatMessage = ({ message, role }: ChatMessageProps) => {
  return (
    <div className={`${styles.chatMessage} ${role === 'user' ? styles['chatMessage--user'] : styles['chatMessage--assistant']}`}>
      <div className={`${styles.bubble} ${role === 'user' ? styles['bubble--user'] : styles['bubble--assistant']}`}>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
};