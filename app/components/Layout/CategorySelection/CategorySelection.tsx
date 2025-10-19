"use client"
import React from 'react';
import styles from './CategorySelection.module.scss';

type Category = {
  id: string | number;
  name: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'indigo' | 'yellow';
  icon?: React.ReactNode;
};

interface CategorySelectionProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const CategorySelection = ({ categories, onSelect }: CategorySelectionProps) => {
  return (
    <div className={styles.categorySelection}>
      <h2 className={styles.header}>What service do you need?</h2>
      <div className={styles.categoryGrid}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            className={`${styles.categoryCard} ${styles[`color${category.color?.charAt(0).toUpperCase()}${category.color?.slice(1)}` || 'colorBlue']}`}
          >
            <div className={styles.categoryIcon}>{category.icon}</div>
            <div className={styles.categoryName}>{category.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};