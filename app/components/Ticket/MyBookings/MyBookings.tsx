"use client"
import React from 'react';
 
import styles from './MyBookings.module.scss';
import { TicketCard } from '../TicketCard/TicketCard';

export type Booking = {
  id: string | number;
  ticketNumber: string;
  category: { icon: React.ReactNode; name: string };
  service: string;
  date: string;
  time: string;
  // add other booking properties as needed
  [key: string]: unknown;
};

interface MyBookingsProps {
  bookings: Booking[];
  onShowTicket: (booking: Booking) => void;
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
            booking={booking as any} 
            onShowTicket={onShowTicket as any}
          />
        ))}
      </div>
    </div>
  );
};