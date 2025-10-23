'use client';

import React from 'react';
import { X, Calendar, Clock, MapPin, User, Building } from 'lucide-react';
import styles from './TicketModal.module.scss';

interface TicketModalProps {
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
    user: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
    bookedDate: string;
    startTime: string;
    endTime: string;
    status: string;
    type: string;
    notes?: string;
    aiRecommendation?: string;
  };
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.ticket}>
          {/* Header */}
          <div className={styles.ticketHeader}>
            <div className={styles.ticketTitle}>🎫 BOOKING TICKET</div>
            <div className={styles.ticketNumber}>#{booking.ticketNumber}</div>
          </div>

          {/* Status Badge */}
          <div 
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(booking.status) }}
          >
            {booking.status.toUpperCase()}
          </div>

          {/* Company Info */}
          <div className={styles.companySection}>
            <div className={styles.companyIcon}>
              {booking.company.category.icon || '🏢'}
            </div>
            <div className={styles.companyInfo}>
              <h3 className={styles.companyName}>{booking.company.name}</h3>
              <p className={styles.categoryName}>{booking.company.category.name}</p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className={styles.ticketDetails}>
            <div className={styles.detailRow}>
              <User className={styles.icon} size={18} />
              <div className={styles.detailContent}>
                <span className={styles.label}>Customer</span>
                <span className={styles.value}>
                  {booking.user.firstName && booking.user.lastName 
                    ? `${booking.user.firstName} ${booking.user.lastName}`
                    : booking.user.email
                  }
                </span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <Calendar className={styles.icon} size={18} />
              <div className={styles.detailContent}>
                <span className={styles.label}>Date</span>
                <span className={styles.value}>{formatDate(booking.bookedDate)}</span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <Clock className={styles.icon} size={18} />
              <div className={styles.detailContent}>
                <span className={styles.label}>Time</span>
                <span className={styles.value}>
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <Building className={styles.icon} size={18} />
              <div className={styles.detailContent}>
                <span className={styles.label}>Service Type</span>
                <span className={styles.value}>{booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}</span>
              </div>
            </div>

            {booking.notes && (
              <div className={styles.detailRow}>
                <MapPin className={styles.icon} size={18} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Notes</span>
                  <span className={styles.value}>{booking.notes}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Recommendation */}
          {booking.aiRecommendation && (
            <div className={styles.aiRecommendation}>
              <h4>💡 Recommendation</h4>
              <p>{booking.aiRecommendation}</p>
            </div>
          )}

          {/* QR Code Placeholder */}
          <div className={styles.qrSection}>
            <div className={styles.qrCode}>
              <div className={styles.qrPattern}></div>
            </div>
            <p className={styles.qrText}>Scan for quick check-in</p>
          </div>

          {/* Footer */}
          <div className={styles.ticketFooter}>
            <p>Keep this ticket for your appointment</p>
            <p className={styles.bookingId}>Booking ID: #{booking.id}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button className={styles.printButton} onClick={handlePrint}>
            🖨️ Print Ticket
          </button>
          <button className={styles.closeActionButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};