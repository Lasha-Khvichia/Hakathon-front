import React from 'react';
 
import styles from './TimeSelection.module.scss';
import { Clock } from 'lucide-react';

export const TimeSelection: React.FC<{ timeSlots: string[]; onSelect: (time: string) => void }> = ({ timeSlots, onSelect }) => {
  return (
    <div className={styles.timeSelection}>
      <h2 className={styles.header}>
        <Clock className={styles.headerIcon} />
        Select Time
      </h2>
      <div className={styles.timeGrid}>
        {timeSlots.map(time => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={styles.timeSlot}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};