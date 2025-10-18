"use client"
import React from 'react';
import styles from './ServiceSelection.module.scss';

interface Service {
  id: string | number;
  icon?: React.ReactNode;
  name: string;
}

interface Category {
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'indigo' | 'yellow';
}

type ServiceSelectionProps = {
  category: Category;
  services: Service[];
  onSelect: (service: Service) => void;
};

const getColorStyles = (color?: string) => {
  const colors: Record<string, { bg: string; hover: string }> = {
    blue: { bg: '#3b82f6', hover: '#2563eb' },
    green: { bg: '#10b981', hover: '#059669' },
    purple: { bg: '#a855f7', hover: '#9333ea' },
    red: { bg: '#ef4444', hover: '#dc2626' },
    indigo: { bg: '#6366f1', hover: '#4f46e5' },
    yellow: { bg: '#eab308', hover: '#ca8a04' },
  };
  return colors[color || 'blue'];
};

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  category, 
  services, 
  onSelect 
}) => {
  const [hoveredId, setHoveredId] = React.useState<string | number | null>(null);
  const colorStyle = getColorStyles(category.color);

  return (
    <div className={styles.serviceSelection}>
      <h2 className={styles.header}>
        <span className={styles.categoryIcon}>{category.icon}</span>
        What do you need?
      </h2>
      <div className={styles.serviceGrid}>
        {services.map(service => {
          const isHovered = hoveredId === service.id;
          
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={styles.serviceCard}
              style={{
                backgroundColor: isHovered ? colorStyle.hover : colorStyle.bg,
              }}
            >
              <div className={styles.serviceIcon}>{service.icon}</div>
              <div className={styles.serviceName}>{service.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};