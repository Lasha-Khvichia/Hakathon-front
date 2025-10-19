"use client"
import React, { useState } from 'react';
import styles from './BookingConfirmation.module.scss';
import useBookingAssistant from '../../hooks/useBookingAssistant';

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
  const { loading, result, error, check } = useBookingAssistant();
  const [isPosting, setIsPosting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedCategory || !selectedBranch) return;

    // 1) Ask AI to check availability
    const aiRes = await check({
      category: selectedCategory.name,
      company: selectedBranch.name,
      service: selectedService.name,
      date: selectedDate.full,
      time: selectedTime,
    });

    // If AI says available, proceed to post booking via onConfirm
    if (aiRes && aiRes.isAvailable) {
      try {
        setIsPosting(true);
        await onConfirm();
      } finally {
        setIsPosting(false);
      }
    }
    // if not available, the result and alternatives are shown below
  };
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
      
      {/* Confirm button: runs AI check then posts booking if allowed */}
      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleConfirm}
          className={styles.confirmButton}
          disabled={loading || isPosting}
        >
          {isPosting ? 'Booking...' : loading ? 'Checking...' : 'Confirm & Book'}
        </button>

        {result && (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: result.isAvailable ? '#ecfdf5' : '#fff1f2', border: result.isAvailable ? '1px solid #10b981' : '1px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: result.isAvailable ? '#10b981' : '#ef4444' }} />
              <div style={{ fontWeight: 600 }}>{result.isAvailable ? 'Available' : 'Unavailable'}</div>
            </div>
            <div style={{ marginTop: 8 }}>{result.message}</div>
            {result.alternativeSlots && result.alternativeSlots.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <strong>Alternative slots:</strong>
                <ul>
                  {result.alternativeSlots.map((a: any, i: number) => (
                    <li key={i}>{a.date} {a.time}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
};