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

  const transformBookingForTicket = (booking: BookingData) => ({
    ticketNumber: booking.id || 'N/A',
    category: { 
      icon: booking.category?.icon || null, 
      name: booking.category?.name || 'Unknown' 
    },
    service: { 
      icon: booking.service?.icon || null, 
      name: booking.service?.name || 'Unknown' 
    },
    branch: booking.branch ? { name: booking.branch.name } : undefined,
    date: { full: booking.date?.toString() || 'Unknown' },
    time: booking.time || 'Unknown'
  });

  return (
    <div className={styles.myBookings}>
      <h3 className={styles.title}>My Bookings</h3>
      <div className={styles.bookingsList}>
        {bookings.map(booking => (
          <TicketCard 
            key={booking.id}
            booking={transformBookingForTicket(booking)}
            onShowTicket={() => onShowTicket(booking)}
          />
        ))}
      </div>
    </div>
  );
};