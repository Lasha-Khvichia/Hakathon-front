"use client"
import React from 'react';
import styles from './TicketCard.module.scss';

type Booking = {
  ticketNumber: string | number;
  category: { icon: React.ReactNode; name: string };
  service: { icon: React.ReactNode; name: string };
  branch?: { name: string };
  date: { full: string };
  time: string;
};

type Props = {
  booking: Booking;
  onShowTicket: (booking: Booking) => void;
};

export const TicketCard = ({ booking, onShowTicket }: Props) => {
  return (
    <div className={styles.ticketCard}>
      <div className={styles.cardContent}>
        <div className={styles.ticketInfo}>
          <div className={styles.ticketNumber}>
            Ticket #{booking.ticketNumber}
          </div>
          <div className={styles.ticketDetail}>
            {booking.category.icon} {booking.category.name} • {booking.service.icon} {booking.service.name}
          </div>
          {booking.branch && (
            <div className={styles.ticketDetail}>
              🏢 {booking.branch.name}
            </div>
          )}
          <div className={styles.ticketDetail}>
            {booking.date.full} • {booking.time}
          </div>
        </div>
        <div className={styles.ticketActions}>
          <div className={styles.statusBadge}>Confirmed</div>
          <button
            onClick={() => onShowTicket(booking)}
            className={styles.showTicketButton}
          >
            Show Ticket
          </button>
        </div>
      </div>
    </div>
  );
};