'use client';

import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, X } from 'lucide-react';
import styles from './BookingSuccessModal.module.scss';

interface BookingSuccessModalProps {
  booking: {
    id: number;
    ticketNumber: string;
    company: {
      name: string;
      category: {
        name: string;
        icon?: string;
      };
    };
    bookedDate: string;
    startTime: string;
    endTime: string;
    aiRecommendation?: string;
  };
  onClose: () => void;
  onViewBookings?: () => void;
  onShowTicket?: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  onClose,
  onViewBookings,
  onShowTicket,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.header}>
          <CheckCircle className={styles.successIcon} size={64} />
          <h2 className={styles.title}>Booking Confirmed!</h2>
          <p className={styles.subtitle}>
            Your appointment has been successfully scheduled
          </p>
        </div>

        <div className={styles.bookingDetails}>
          {/* Ticket Number Section */}
          <div className={styles.ticketSection}>
            <div className={styles.ticketNumber}>#{booking.ticketNumber}</div>
            <div className={styles.ticketLabel}>Your Ticket Number</div>
          </div>

          <div className={styles.companyInfo}>
            <div className={styles.companyIcon}>
              {booking.company.category.icon || '🏢'}
            </div>
            <div>
              <h3 className={styles.companyName}>{booking.company.name}</h3>
              <p className={styles.categoryName}>{booking.company.category.name}</p>
            </div>
          </div>

          <div className={styles.appointmentInfo}>
            <div className={styles.infoRow}>
              <Calendar className={styles.icon} size={20} />
              <span>{formatDate(booking.bookedDate)}</span>
            </div>
            <div className={styles.infoRow}>
              <Clock className={styles.icon} size={20} />
              <span>
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <MapPin className={styles.icon} size={20} />
              <span>Service Location</span>
            </div>
          </div>

          {booking.aiRecommendation && (
            <div className={styles.aiRecommendation}>
              <h4>💡 AI Recommendation</h4>
              <p>{booking.aiRecommendation}</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {onShowTicket && (
            <button className={styles.primaryButton} onClick={onShowTicket}>
              🎫 Show Full Ticket
            </button>
          )}
          {onViewBookings && (
            <button className={styles.primaryButton} onClick={onViewBookings}>
              View My Bookings
            </button>
          )}
          <button className={styles.secondaryButton} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};