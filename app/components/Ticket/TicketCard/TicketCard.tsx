"use client"
import React from 'react';
import styles from './TicketCard.module.scss';
import { BookingData } from '../../../types';

type Props = {
  booking: BookingData;
  onShowTicket: (booking: BookingData) => void;
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
            {booking.category?.icon} {booking.category?.name} • {booking.service?.icon} {booking.service?.name}
          </div>
          {booking.branch && (
            <div className={styles.ticketDetail}>
              🏢 {booking.branch.name}
            </div>
          )}
          <div className={styles.ticketDetail}>
            {typeof booking.date === 'string' ? booking.date : booking.date?.toLocaleDateString()} • {booking.time}
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