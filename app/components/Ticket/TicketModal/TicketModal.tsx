"use client"
import React from 'react';
 
import styles from './TicketModal.module.scss';
import { CheckCircle } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: {
    ticketNumber: string | number;
    category: { icon?: React.ReactNode; name: string };
    service: { icon?: React.ReactNode; name: string };
    branch?: { name: string; address?: string } | null;
    date: { full: string };
    time: string;
  } | null;
}

export const TicketModal = ({ isOpen, onClose, ticket }: TicketModalProps) => {
  if (!isOpen || !ticket) return null;

  return (
    <div 
      className={styles.ticketModal}
      onClick={onClose}
    >
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalCenter}>
          <div className={styles.iconWrapper}>
            <CheckCircle className={styles.icon} />
          </div>
          <h2 className={styles.title}>Your Ticket</h2>
          <p className={styles.subtitle}>Please show this at the counter</p>
          
          <div className={styles.ticketCard}>
            <div className={styles.ticketNumber}>
              #{ticket.ticketNumber}
            </div>
            <div className={styles.ticketLabel}>Ticket Number</div>
          </div>

          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <div className={styles.detailItemLabel}>Category</div>
              <div className={styles.detailItemValue}>
                <span>{ticket.category.icon}</span>
                {ticket.category.name}
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailItemLabel}>Service</div>
              <div className={styles.detailItemValue}>
                <span>{ticket.service.icon}</span>
                {ticket.service.name}
              </div>
            </div>

            {ticket.branch && (
              <div className={styles.detailItem}>
                <div className={styles.detailItemLabel}>Branch</div>
                <div className={styles.detailItemValue}>{ticket.branch.name}</div>
                <div className={styles.detailItemAddress}>{ticket.branch.address}</div>
              </div>
            )}
            
            <div className={styles.detailItem}>
              <div className={styles.detailItemLabel}>Date & Time</div>
              <div className={styles.detailItemValue}>
                📅 {ticket.date.full}
              </div>
              <div className={styles.detailItemValue}>
                🕐 {ticket.time}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};