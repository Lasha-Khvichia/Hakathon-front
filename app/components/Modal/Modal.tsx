"use client"
import React from 'react';
import styles from './Modal.module.scss';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <button
              onClick={onClose}
              className={styles.closeButton}
            >
              <X className={styles.closeIcon} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};