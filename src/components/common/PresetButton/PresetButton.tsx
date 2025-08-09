import React from 'react';
import { PresetKey } from '../../../config/presetConfig';
import styles from './PresetButton.module.scss';

interface PresetButtonProps {
  presetKey: PresetKey;
  name: string;
  icon: string;
  description: string;
  isSelected?: boolean;
  isPsycho?: boolean;
  showUnlockedLabel?: boolean;
  onClick: (preset: PresetKey) => void;
  className?: string;
  type?: 'button' | 'radio';
}

const PresetButton: React.FC<PresetButtonProps> = ({
  presetKey,
  name,
  icon,
  description,
  isSelected = false,
  isPsycho = false,
  showUnlockedLabel = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseClasses = `${styles.presetButton} ${isPsycho ? styles.psychoButton : ''} ${className}`;

  if (type === 'radio') {
    return (
      <label className={`${styles.presetOption} ${isPsycho ? styles.psychoOption : ''}`}>
        <input
          type="radio"
          name="preset"
          value={presetKey}
          checked={isSelected}
          onChange={() => onClick(presetKey)}
          className={styles.presetRadio}
        />
        <div className={`${styles.presetCard} ${isPsycho ? styles.psychoCard : ''} ${isSelected ? styles.selected : ''}`}>
          <div className={styles.presetIcon}>{icon}</div>
          <div className={styles.presetContent}>
            <div className={styles.presetName}>
              {name}
              {showUnlockedLabel && <span className={styles.unlockedBadge}>UNLOCKED!</span>}
            </div>
            <div className={styles.presetDesc}>{description}</div>
          </div>
        </div>
      </label>
    );
  }

  return (
    <button 
      type="button"
      className={baseClasses}
      onClick={() => onClick(presetKey)}
    >
      <div className={styles.presetTitle}>
        {icon} {name}
        {showUnlockedLabel && <div className={styles.psychoLabel}>UNLOCKED!</div>}
      </div>
      <div className={styles.presetDesc}>{description}</div>
    </button>
  );
};

export default PresetButton; 