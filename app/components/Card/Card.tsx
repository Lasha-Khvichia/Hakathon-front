"use client"
import React from 'react';
import styles from './Card.module.scss';

type CardProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
};