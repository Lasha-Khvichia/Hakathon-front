"use client"
import React from 'react';
 
import styles from './AIChatButton.module.scss';
import { MessageCircle } from 'lucide-react';

export const AIChatButton = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button
      onClick={onClick}
      className={styles.aiChatButton}
    >
      <MessageCircle className={styles.icon} />
    </button>
  );
};