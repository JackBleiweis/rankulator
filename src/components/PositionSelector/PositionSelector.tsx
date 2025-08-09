import React, { useState } from 'react';
import { GameSettings } from '../Settings/Settings';
import styles from './PositionSelector.module.scss';
import RankulatorTitle from '../RankulatorTitle/RankulatorTitle';

interface PositionSelectorProps {
  onPositionSelect: (position: string, playerCount: number, gameSettings: GameSettings) => void;
  loading: boolean;
  selectedPosition: string;
  error?: string;
}

// Position configuration
const POSITION_CONFIG = {
  QB: { 
    name: 'Quarterbacks', 
    default: 16, 
    min: 8, 
    max: 32, 
    description: 'Essential QB rankings for your league'
  },
  RB: { 
    name: 'Running Backs', 
    default: 20, 
    min: 10, 
    max: 50, 
    description: 'Top RBs including handcuffs and sleepers'
  },
  WR: { 
    name: 'Wide Receivers', 
    default: 30, 
    min: 15, 
    max: 75, 
    description: 'Deep WR rankings for all roster spots'
  },
  TE: { 
    name: 'Tight Ends', 
    default: 12, 
    min: 6, 
    max: 32, 
    description: 'Key TEs for streaming and starting'
  }
} as const;

// Preset configurations
const PRESET_CONFIG = {
  quick: {
    name: 'Quick',
    icon: '⚡',
    description: '8 batches • 1-3 min',
    settings: {
      batchSize: 6,
      explorationBatches: 3,
      mixedBatches: 2,
      refinementBatches: 3
    }
  },
  normal: {
    name: 'Normal',
    icon: '⚖️',
    description: '24 batches • 3-6 min',
    settings: {
      batchSize: 6,
      explorationBatches: 5,
      mixedBatches: 5,
      refinementBatches: 5
    }
  },
  extensive: {
    name: 'Extensive',
    icon: '🔍',
    description: '35 batches • 6-10 min',
    settings: {
      batchSize: 6,
      explorationBatches: 8,
      mixedBatches: 8,
      refinementBatches: 8
    }
  }
} as const;

const PositionSelector: React.FC<PositionSelectorProps> = ({
  onPositionSelect,
  loading,
  selectedPosition,
  error
}) => {
  const [tempSelectedPosition, setTempSelectedPosition] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<number>(16);
  const [selectedPreset, setSelectedPreset] = useState<'quick' | 'normal' | 'extensive'>('normal');

  const handlePositionClick = (position: string) => {
    const config = POSITION_CONFIG[position as keyof typeof POSITION_CONFIG];
    setTempSelectedPosition(position);
    setPlayerCount(config.default);
  };

  const handleStartRanking = () => {
    if (tempSelectedPosition) {
      const presetSettings = PRESET_CONFIG[selectedPreset].settings;
      onPositionSelect(tempSelectedPosition, playerCount, presetSettings);
    }
  };

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerCount(parseInt(e.target.value));
  };

  const handlePresetChange = (preset: 'quick' | 'normal' | 'extensive') => {
    setSelectedPreset(preset);
  };

  const currentConfig = tempSelectedPosition ? POSITION_CONFIG[tempSelectedPosition as keyof typeof POSITION_CONFIG] : null;
  const currentPreset = PRESET_CONFIG[selectedPreset];

  const getPresetName = (playerCount: number) => {
    if (playerCount <= 12) return 'Quick';
    if (playerCount <= 24) return 'Normal';
    return 'Extensive';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <RankulatorTitle />
          <p className={styles.subtitle}>
            Find your favorite players through elimination rounds!
          </p>
        </div>
      </div>
    
      {!tempSelectedPosition ? (
        <>
          <div className={styles.sectionHeader}>
            <h2>Select Position to Rank</h2>
            <p>
              Choose which position you'd like to rank. We'll load the top players and start the elimination process.
            </p>
          </div>
          
          <div className={styles.positionButtons}>
            {Object.entries(POSITION_CONFIG).map(([position, config]) => (
              <button
                key={position}
                onClick={() => handlePositionClick(position)}
                disabled={loading}
                className={`${styles.positionButton} ${styles.active}`}
              >
                {config.name}
                <br />
                <small>({config.min}-{config.max} players)</small>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.sectionHeader}>
            <h2>Customize Your {currentConfig?.name} Ranking</h2>
            <p>{currentConfig?.description}</p>
          </div>

          <div className={styles.sliderSection}>
            <div className={styles.sliderHeader}>
              <h3>Number of Players to Rank</h3>
              <span className={styles.playerCount}>{playerCount} players</span>
            </div>
            
            <div className={styles.sliderContainer}>
              <span className={styles.sliderLabel}>{currentConfig?.min}</span>
              <input
                type="range"
                min={currentConfig?.min}
                max={currentConfig?.max}
                value={playerCount}
                onChange={handlePlayerCountChange}
                className={styles.slider}
              />
              <span className={styles.sliderLabel}>{currentConfig?.max}</span>
            </div>
            
            <div className={styles.sliderDescription}>
              <p>
                Fewer players = quicker ranking, more players = comprehensive depth chart.
                Recommended: <strong>{currentConfig?.default} players</strong>
              </p>
            </div>
          </div>

          <div className={styles.presetsSection}>
            <div className={styles.presetsHeader}>
              <h3>Ranking Intensity</h3>
              <p style={{ marginBottom: '4px' }}>Choose how thorough you want your ranking process to be</p>
              <p>With {playerCount} players, we recommend the <strong>{getPresetName(playerCount)}</strong> preset.</p>
            </div>

            <div className={styles.presetOptions}>
              {Object.entries(PRESET_CONFIG).map(([key, preset]) => (
                <label key={key} className={styles.presetOption}>
                  <input
                    type="radio"
                    name="preset"
                    value={key}
                    checked={selectedPreset === key}
                    onChange={() => handlePresetChange(key as 'quick' | 'normal' | 'extensive')}
                    className={styles.presetRadio}
                  />
                  <div className={styles.presetCard}>
                    <div className={styles.presetIcon}>{preset.icon}</div>
                    <div className={styles.presetContent}>
                      <div className={styles.presetName}>{preset.name}</div>
                      <div className={styles.presetDesc}>{preset.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={() => setTempSelectedPosition('')}
              className={styles.backButton}
              disabled={loading}
            >
              ← Back to Positions
            </button>
            
            <button
              onClick={handleStartRanking}
              disabled={loading}
              className={styles.startButton}
            >
              {loading && selectedPosition === tempSelectedPosition ? 
                'Loading...' : 
                `Start ${currentPreset.name} Ranking (${playerCount} ${currentConfig?.name})`
              }
            </button>
          </div>
        </>
      )}
    
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
};

export default PositionSelector; 