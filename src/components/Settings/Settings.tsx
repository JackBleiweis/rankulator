import React, { useState } from 'react';
import { PRESET_CONFIG, PresetKey } from '../../config/presetConfig';
import styles from './Settings.module.scss';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: GameSettings) => void;
  currentSettings: GameSettings;
  psychoModeUnlocked?: boolean;
}

export interface GameSettings {
  batchSize: number;
  explorationBatches: number;
  mixedBatches: number;
  refinementBatches: number;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings,
  psychoModeUnlocked = false
}) => {
  const [settings, setSettings] = useState<GameSettings>(currentSettings);

  const isValidSettings = () => {
    const batchSize = Number(settings.batchSize);
    const exploration = Number(settings.explorationBatches);
    const mixed = Number(settings.mixedBatches);
    const refinement = Number(settings.refinementBatches);

    return (
      batchSize >= 3 && batchSize <= 8 &&
      exploration >= 1 && exploration <= 20 &&
      mixed >= 0 && mixed <= 20 &&
      refinement >= 0 && refinement <= 20 &&
      (exploration + mixed + refinement) > 0
    );
  };

  const handleSave = () => {
    if (isValidSettings()) {
      onSave(settings);
      onClose();
    }
  };

  const handleReset = () => {
    const defaultSettings: GameSettings = {
      batchSize: 8,
      explorationBatches: 5,
      mixedBatches: 5,
      refinementBatches: 5
    };
    setSettings(defaultSettings);
  };

  const handlePreset = (preset: PresetKey) => {
    const presetSettings = PRESET_CONFIG[preset].settings;
    setSettings(presetSettings);
  };

  const totalBatches = (settings.explorationBatches || 0) + (settings.mixedBatches || 0) + (settings.refinementBatches || 0);
  const isValid = isValidSettings();
  const batchSizeValid = Number(settings.batchSize) >= 3 && Number(settings.batchSize) <= 8;
  const explorationValid = Number(settings.explorationBatches) >= 1 && Number(settings.explorationBatches) <= 20;
  const mixedValid = Number(settings.mixedBatches) >= 0 && Number(settings.mixedBatches) <= 20;
  const refinementValid = Number(settings.refinementBatches) >= 0 && Number(settings.refinementBatches) <= 20;
  const totalBatchesValid = totalBatches > 0;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>⚙️ Ranking Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.presets}>
            <h3>Quick Presets</h3>
            <div className={styles.presetButtons}>
              {Object.entries(PRESET_CONFIG)
                .filter(([key]) => key !== 'psycho' || psychoModeUnlocked)
                .map(([key, preset]) => (
                <button 
                  key={key}
                  type="button"
                  className={`${styles.presetButton} ${key === 'psycho' ? styles.psychoButton : ''}`}
                  onClick={() => handlePreset(key as PresetKey)}
                >
                  <div className={styles.presetTitle}>
                    {preset.icon} {preset.name}
                    {key === 'psycho' && <div className={styles.psychoLabel}>UNLOCKED!</div>}
                  </div>
                  <div className={styles.presetDesc}>{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.divider}></div>

          <h3>Custom Settings</h3>
          <div className={styles.setting}>
            <label htmlFor="batchSize">Players per batch:</label>
            <input
              id="batchSize"
              type="number"
              min="3"
              max="8"
              value={settings.batchSize}
              className={!batchSizeValid ? styles.invalid : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  // Allow empty input temporarily
                  setSettings({
                    ...settings,
                    batchSize: '' as any
                  });
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue)) {
                    setSettings({
                      ...settings,
                      batchSize: numValue
                    });
                  }
                }
              }}
              onBlur={(e) => {
                // Set to default if empty when focus is lost
                if (e.target.value === '') {
                  setSettings({
                    ...settings,
                    batchSize: 6
                  });
                }
              }}
            />
            <small className={!batchSizeValid ? styles.errorText : ''}>
              How many players to show at once (3-8)
              {!batchSizeValid && ' - Must be between 3 and 8'}
            </small>
          </div>

          <h3>Batch Distribution</h3>
          <div className={styles.phaseSettings}>
            <div className={styles.setting}>
              <label htmlFor="exploration">🔍 Exploration Phase:</label>
              <input
                id="exploration"
                type="number"
                min="1"
                max="20"
                value={settings.explorationBatches}
                className={!explorationValid ? styles.invalid : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setSettings({
                      ...settings,
                      explorationBatches: '' as any
                    });
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      setSettings({
                        ...settings,
                        explorationBatches: numValue
                      });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setSettings({
                      ...settings,
                      explorationBatches: 5
                    });
                  }
                }}
              />
              <small className={!explorationValid ? styles.errorText : ''}>
                Random batches to build initial rankings (1-20)
                {!explorationValid && ' - Must be between 1 and 20'}
              </small>
            </div>

            <div className={styles.setting}>
              <label htmlFor="mixed">🔄 Mixed Phase:</label>
              <input
                id="mixed"
                type="number"
                min="0"
                max="20"
                value={settings.mixedBatches}
                className={!mixedValid ? styles.invalid : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setSettings({
                      ...settings,
                      mixedBatches: '' as any
                    });
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      setSettings({
                        ...settings,
                        mixedBatches: numValue
                      });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setSettings({
                      ...settings,
                      mixedBatches: 5
                    });
                  }
                }}
              />
              <small className={!mixedValid ? styles.errorText : ''}>
                Mix of similar and random batches (0-20)
                {!mixedValid && ' - Must be between 0 and 20'}
              </small>
            </div>

            <div className={styles.setting}>
              <label htmlFor="refinement">🎯 Refinement Phase:</label>
              <input
                id="refinement"
                type="number"
                min="0"
                max="20"
                value={settings.refinementBatches}
                className={!refinementValid ? styles.invalid : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setSettings({
                      ...settings,
                      refinementBatches: '' as any
                    });
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      setSettings({
                        ...settings,
                        refinementBatches: numValue
                      });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setSettings({
                      ...settings,
                      refinementBatches: 5
                    });
                  }
                }}
              />
              <small className={!refinementValid ? styles.errorText : ''}>
                Similar-score batches for fine-tuning (0-20)
                {!refinementValid && ' - Must be between 0 and 20'}
              </small>
            </div>
          </div>

          <div className={`${styles.summary} ${!totalBatchesValid ? styles.summaryError : ''}`}>
            <strong>Total Batches: {totalBatches}</strong>
            {totalBatchesValid ? (
              <p>Estimated time: {Math.ceil(totalBatches * 0.15)} - {Math.ceil(totalBatches * 0.4)} minutes</p>
            ) : (
              <p className={styles.errorText}>⚠️ Total batches must be greater than 0</p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.resetButton} onClick={handleReset}>
            Reset to Defaults
          </button>
          <div className={styles.primaryActions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button 
              className={`${styles.saveButton} ${!isValid ? styles.saveButtonDisabled : ''}`} 
              onClick={handleSave}
              disabled={!isValid}
              title={!isValid ? 'Please fix validation errors before saving' : 'Save settings'}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 