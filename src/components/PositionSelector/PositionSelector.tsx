import React, { useState } from 'react';
import { GameSettings } from '../Settings/Settings';
import { POSITION_CONFIG, PositionKey } from '../../config/positionConfig';
import { PRESET_CONFIG, PresetKey } from '../../config/presetConfig';
import PresetButton from '../common/PresetButton/PresetButton';
import styles from './PositionSelector.module.scss';
import RankulatorTitle from '../RankulatorTitle/RankulatorTitle';

interface PositionSelectorProps {
  onPositionSelect: (position: string, playerCount: number, gameSettings: GameSettings) => void;
  loading: boolean;
  selectedPosition: string;
  error?: string;
  psychoModeUnlocked?: boolean;
}



const PositionSelector: React.FC<PositionSelectorProps> = ({
  onPositionSelect,
  loading,
  selectedPosition,
  error,
  psychoModeUnlocked = false
}) => {
  const [tempSelectedPosition, setTempSelectedPosition] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<number>(16);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('normal');

  const handlePositionClick = (position: string) => {
    const config = POSITION_CONFIG[position as PositionKey];
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

  const handlePresetChange = (preset: PresetKey) => {
    setSelectedPreset(preset);
  };

  const currentConfig = tempSelectedPosition ? POSITION_CONFIG[tempSelectedPosition as PositionKey] : null;
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
              {Object.entries(PRESET_CONFIG)
                .filter(([key]) => key !== 'psycho' || psychoModeUnlocked)
                .map(([key, preset]) => (
                <PresetButton
                  key={key}
                  presetKey={key as PresetKey}
                  name={preset.name}
                  icon={preset.icon}
                  description={preset.description}
                  isSelected={selectedPreset === key}
                  isPsycho={key === 'psycho'}
                  showUnlockedLabel={key === 'psycho'}
                  onClick={handlePresetChange}
                  type="radio"
                />
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