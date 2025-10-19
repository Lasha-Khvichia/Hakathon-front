"use client"
import React from 'react';
import { Calendar } from 'lucide-react';
import styles from './DateSelection.module.scss';
import { getNextDays } from '../../../utils/dateHelper';
import { DateInfo } from '../../AppComponents/types';
 

interface DateSelectionProps {
  onSelect: (day: DateInfo) => void;
}

export const DateSelection: React.FC<DateSelectionProps> = ({ onSelect }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const days = getNextDays(14);

  return (
    <div className={styles.dateSelection}>
      <h2 className={styles.header}>
        <Calendar className={styles.headerIcon} />
        Select Date
      </h2>
      <div className={styles.dateGrid}>
        {days.map((day, index) => {
          const isHovered = hoveredIndex === index;
          
          return (
            <button
              key={index}
              onClick={() => onSelect(day)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={styles.dateCard}
              style={{
                background: isHovered 
                  ? 'linear-gradient(to bottom right, #6366f1, #8b5cf6)'
                  : 'linear-gradient(to bottom right, #6366f1, #a855f7)',
              }}
            >
              <div className={styles.dateDay}>{day.day}</div>
              <div className={styles.dateNum}>{day.num}</div>
              <div className={styles.dateMonth}>{day.month}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};