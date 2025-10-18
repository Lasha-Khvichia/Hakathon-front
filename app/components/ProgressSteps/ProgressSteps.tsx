"use client"
import React from 'react';
import styles from './ProgressSteps.module.scss';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  const getStepClass = (index: number): string => {
    if (currentStep > index + 1) return styles['stepCircle--completed'];
    if (currentStep === index + 1) return styles['stepCircle--current'];
    return styles['stepCircle--upcoming'];
  };

  return (
    <div className={styles.progressSteps}>
      <div className={styles.stepsContainer}>
        {steps.map((label: string, index: number) => (
          <div key={label} className={styles.stepWrapper}>
            <div className={`${styles.stepCircle} ${getStepClass(index)}`}>
              {currentStep > index + 1 ? '✓' : index + 1}
            </div>
            <span className={styles.stepLabel}>
              {label}
            </span>
            {index < steps.length - 1 && (
              <div className={styles.stepConnector} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};