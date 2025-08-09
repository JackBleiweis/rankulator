import React from 'react';
import styles from './StepComponent.module.scss';

interface StepComponentProps {
  stepNumber: number;
  title: string;
  description: string;
}

const StepComponent: React.FC<StepComponentProps> = ({
  stepNumber,
  title,
  description
}) => {
  return (
    <div className={styles.step}>
      <span className={styles.stepNumber}>{stepNumber}</span>
      <div className={styles.stepContent}>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default StepComponent; 