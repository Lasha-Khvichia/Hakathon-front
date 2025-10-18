"use client"
import React from 'react';
 
import styles from './MyBookings.module.scss';
import { TicketCard } from '../TicketCard/TicketCard';
import { BookingData } from '../../../types';

interface MyBookingsProps {
  bookings: BookingData[];
  onShowTicket: (booking: BookingData) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ bookings, onShowTicket }) => {
  if (bookings.length === 0) return null;

  return (
    <div className={styles.myBookings}>
      <h3 className={styles.title}>My Bookings</h3>
      <div className={styles.bookingsList}>
        {bookings.map(booking => (
          <TicketCard 
            key={booking.id} 
            booking={booking} 
            onShowTicket={onShowTicket}
          />
        ))}
      </div>
    </div>
  );
};