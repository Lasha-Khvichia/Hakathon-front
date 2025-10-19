import React from 'react';
 
import styles from './BookingSuccess.module.scss';
import { CheckCircle } from 'lucide-react';

type Booking = {
  ticketNumber: string | number;
  category: {
    icon?: React.ReactNode;
    name: string;
  };
  service: {
    icon?: React.ReactNode;
    name: string;
  };
  branch?: {
    name: string;
  } | null;
  date: {
    full: string;
  };
  time: string;
};

type BookingSuccessProps = {
  booking: Booking;
  onBookAnother: () => void;
};

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ 
  booking, 
  onBookAnother 
}) => {
  return (
    <div className={styles.bookingSuccess}>
      <div className={styles.iconWrapper}>
        <CheckCircle className={styles.icon} />
      </div>
      
      <h2 className={styles.title}>Booking Confirmed!</h2>
      
      <div className={styles.ticketCard}>
        <div className={styles.ticketNumber}>
          #{booking.ticketNumber}
        </div>
        <div className={styles.ticketLabel}>Your Ticket Number</div>
        <div className={styles.ticketDetails}>
          <div>{booking.category.icon} {booking.category.name}</div>
          <div>{booking.service.icon} {booking.service.name}</div>
          {booking.branch && <div>🏢 {booking.branch.name}</div>}
          <div>📅 {booking.date.full}</div>
          <div>🕐 {booking.time}</div>
        </div>
      </div>
      
      <button
        onClick={onBookAnother}
        className={styles.bookAnotherButton}
      >
        Book Another Appointment
      </button>
    </div>
  );
};