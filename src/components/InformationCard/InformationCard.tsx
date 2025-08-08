import React from 'react';
import styles from './InformationCard.module.scss';

interface InformationCardProps {
  title?: string;
  description: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'info';
}

const InformationCard: React.FC<InformationCardProps> = ({
  title,
  description,
  children,
  variant = 'default'
}) => {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <p className={styles.description}>{description}</p>
      {children && (
        <div className={styles.actions}>
          {children}
        </div>
      )}
    </div>
  );
};

export default InformationCard; 