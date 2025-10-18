"use client"
import React from 'react';
import { Calendar } from 'lucide-react';
import styles from './DateSelection.module.scss';

export interface Day {
  date: Date;
  day: string;
  num: number;
  month: string;
  full: string;
}

interface DateSelectionProps {
  onSelect: (day: Day) => void;
}

const getNextDays = (numDays: number = 14): Day[] => {
  const days: Day[] = [];
  const today = new Date();
  
  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      num: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      full: date.toLocaleDateString('en-US')
    });
  }
  
  return days;
};

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