"use client"
import React from 'react';
import styles from './ApiKeySetup.module.scss';
import { MessageCircle } from 'lucide-react';

export const ApiKeySetup = () => {
  return (
    <div className={styles.apiKeySetup}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <MessageCircle className={styles.icon} />
          </div>
          <h3 className={styles.title}>AI Assistant</h3>
          <p className={styles.description}>Welcome to the AI chat interface</p>
        </div>
      </div>
    </div>
  );
};