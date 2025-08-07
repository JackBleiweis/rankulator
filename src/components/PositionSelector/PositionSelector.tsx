import React, { useState } from 'react';
import Settings, { GameSettings } from '../Settings/Settings';
import styles from './PositionSelector.module.scss';

interface PositionSelectorProps {
  onPositionSelect: (position: string) => void;
  loading: boolean;
  selectedPosition: string;
  error?: string;
  onSettingsChange?: (settings: GameSettings) => void;
  currentSettings?: GameSettings;
}

const PositionSelector: React.FC<PositionSelectorProps> = ({
  onPositionSelect,
  loading,
  selectedPosition,
  error,
  onSettingsChange,
  currentSettings
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const defaultSettings: GameSettings = {
    batchSize: 6,
    explorationBatches: 5,
    mixedBatches: 5,
    refinementBatches: 5
  };

  const handleSettingsChange = (settings: GameSettings) => {
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>🏈 Rankulator</h1>
            <p className={styles.subtitle}>
              Find your favorite players through elimination rounds!
            </p>
          </div>
          <button 
            className={styles.settingsButton}
            onClick={() => setShowSettings(true)}
            title="Customize ranking settings"
          >
            ⚙️
          </button>
        </div>
      
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

        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsChange}
          currentSettings={currentSettings || defaultSettings}
        />
      </div>
    </>
  );
};

export default PositionSelector; 