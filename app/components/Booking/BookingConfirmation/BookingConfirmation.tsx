"use client"
import React from 'react';
import styles from './BookingConfirmation.module.scss';

interface BookingConfirmationProps {
  selectedCategory: {
    name: string;
    icon?: React.ReactNode;
  };
  selectedService: {
    name: string;
    icon?: React.ReactNode;
  };
  selectedBranch?: {
    name: string;
    address?: string;
  };
  selectedDate: {
    full: string;
  };
  selectedTime: string;
  onConfirm: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  selectedCategory, 
  selectedService, 
  selectedBranch, 
  selectedDate, 
  selectedTime, 
  onConfirm 
}) => {
  return (
    <div className={styles.bookingConfirmation}>
      <h2 className={styles.title}>Confirm Your Booking</h2>
      <div className={styles.detailsList}>
        <div className={`${styles.detailItem} ${styles['detailItem--category']}`}>
          <div className={styles.detailLabel}>Category</div>
          <div className={styles.detailValue}>
            <span>{selectedCategory.icon}</span>
            {selectedCategory.name}
          </div>
        </div>
        
        <div className={`${styles.detailItem} ${styles['detailItem--service']}`}>
          <div className={styles.detailLabel}>Service</div>
          <div className={styles.detailValue}>
            <span>{selectedService.icon}</span>
            {selectedService.name}
          </div>
        </div>
        
        {selectedBranch && (
          <div className={`${styles.detailItem} ${styles['detailItem--branch']}`}>
            <div className={styles.detailLabel}>Branch</div>
            <div className={styles.detailValue}>{selectedBranch.name}</div>
            <div className={styles.detailAddress}>{selectedBranch.address}</div>
          </div>
        )}
        
        <div className={`${styles.detailItem} ${styles['detailItem--date']}`}>
          <div className={styles.detailLabel}>Date</div>
          <div className={styles.detailValue}>{selectedDate.full}</div>
        </div>
        
        <div className={`${styles.detailItem} ${styles['detailItem--time']}`}>
          <div className={styles.detailLabel}>Time</div>
          <div className={styles.detailValue}>{selectedTime}</div>
        </div>
      </div>
      
      <button
        onClick={onConfirm}
        className={styles.confirmButton}
      >
        Confirm Booking
      </button>
    </div>
  );
};