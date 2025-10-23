"use client"
import React from 'react';
import styles from './CategorySelection.module.scss';
import { CategoryTypes } from '@/app/BackAPI/CategoryTypes';

interface CategorySelectionProps {
  categories: CategoryTypes[];
  onSelect: (category: CategoryTypes) => void;
}

const getColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    blue: styles.colorBlue,
    green: styles.colorGreen,
    purple: styles.colorPurple,
    red: styles.colorRed,
    indigo: styles.colorIndigo,
    yellow: styles.colorYellow,
  };
  return colorMap[color.toLowerCase()] || styles.colorBlue;
};

export const CategorySelection = ({ categories, onSelect }: CategorySelectionProps) => {
  return (
    <div className={styles.categorySelection}>
      <h2 className={styles.header}>What service do you need?</h2>
      <div className={styles.categoryGrid}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            className={`${styles.categoryCard} ${getColorClass(category.color)}`}
          >
            <div className={styles.categoryIcon}>
              {category.icon || String(category.name).charAt(0).toUpperCase()}
            </div>
            <div className={styles.categoryName}>{category.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};