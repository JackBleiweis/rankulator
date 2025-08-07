import React from 'react';
import RankulatorTitle from '../RankulatorTitle/RankulatorTitle';
import styles from './PositionSelector.module.scss';

interface PositionSelectorProps {
  onPositionSelect: (position: string) => void;
  loading: boolean;
  selectedPosition: string;
  error?: string;
}

const PositionSelector: React.FC<PositionSelectorProps> = ({
  onPositionSelect,
  loading,
  selectedPosition,
  error
}) => {
  return (
    <div className={styles.container}>
      <RankulatorTitle />
      <p className={styles.subtitle}>
        Find your favorite players through elimination rounds!
      </p>
      
      <div className={styles.sectionHeader}>
        <h2>Select Position to Rank</h2>
        <p>
          Choose which position you'd like to rank. We'll load the top players and start the elimination process.
        </p>
      </div>
      
      <div className={styles.positionButtons}>
        <button
          onClick={() => onPositionSelect('QB')}
          disabled={loading}
          className={`${styles.positionButton} ${styles.active}`}
        >
          {loading && selectedPosition === 'QB' ? 'Loading...' : 'Quarterbacks'}
        </button>
        
        {/* Future positions - disabled for now */}
        <button
          disabled
          className={`${styles.positionButton} ${styles.disabled}`}
        >
          Running Backs
          <br />
          <small>(Coming Soon)</small>
        </button>
        
        <button
          disabled
          className={`${styles.positionButton} ${styles.disabled}`}
        >
          Wide Receivers
          <br />
          <small>(Coming Soon)</small>
        </button>
        
        <button
          disabled
          className={`${styles.positionButton} ${styles.disabled}`}
        >
          Tight Ends
          <br />
          <small>(Coming Soon)</small>
        </button>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
};

export default PositionSelector; 