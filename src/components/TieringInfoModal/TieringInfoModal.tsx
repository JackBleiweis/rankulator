import React from 'react';
import Modal from '../Modal/Modal';
import styles from './TieringInfoModal.module.scss';

interface TieringInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  showPlayerScores: boolean;
  onToggleScores: (show: boolean) => void;
  psychoMode: boolean;
  onTogglePsychoMode: (enabled: boolean) => void;
}

const TieringInfoModal: React.FC<TieringInfoModalProps> = ({ isOpen, onClose, showPlayerScores, onToggleScores, psychoMode, onTogglePsychoMode }) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎯 How Our Tiering System Works"
    >
      <div className={styles.section}>
        <h4>🎮 Welcome to the Tiering System</h4>
        <p>
          Our tiering system automatically organizes players into meaningful groups based on their 
          relative performance. This helps you quickly identify talent tiers and make better roster 
          decisions. The system uses advanced statistics while remaining intuitive and easy to understand.
        </p>
        <h4>📈 Statistical Z-Score Analysis</h4>
        <p>
          Instead of arbitrary cutoffs, we use statistical analysis to create meaningful tiers. 
          Each player's final score is converted to a "z-score" - a measure of how many standard 
          deviations they are from the average player's performance.
        </p>
      </div>

      <div className={styles.section}>
        <h4>🎯 Tier Definitions</h4>
        <div className={styles.tierDefinitions}>
          <div className={styles.tierDef}>
            <span className={styles.tierName}>Elite</span>
            <span className={styles.tierRange}>z &ge; +1.0</span>
            <span className={styles.tierDesc}>Exceptional performers - top ~16% of players</span>
          </div>
          <div className={styles.tierDef}>
            <span className={styles.tierName}>Tier 1</span>
            <span className={styles.tierRange}>+0.3 &le; z &lt; +1.0</span>
            <span className={styles.tierDesc}>Strong players - above average performers</span>
          </div>
          <div className={styles.tierDef}>
            <span className={styles.tierName}>Tier 2</span>
            <span className={styles.tierRange}>-0.3 &le; z &lt; +0.3</span>
            <span className={styles.tierDesc}>Average players - the middle ~38% of players</span>
          </div>
          <div className={styles.tierDef}>
            <span className={styles.tierName}>Tier 3</span>
            <span className={styles.tierRange}>-1.0 &le; z &lt; -0.3</span>
            <span className={styles.tierDesc}>Below average - but still viable options</span>
          </div>
          <div className={styles.tierDef}>
            <span className={styles.tierName}>Tier 4</span>
            <span className={styles.tierRange}>z &lt; -1.0</span>
            <span className={styles.tierDesc}>Lower performers - bottom ~16% of players</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4>🔧 Smart Adjustments</h4>
        <ul className={styles.featureList}>
          <li><strong>Fuzzy Boundaries:</strong> Players near tier boundaries can be adjusted to prevent unnatural cutoffs</li>
          <li><strong>Soft Caps:</strong> Tiers have flexible size limits to maintain readability</li>
          <li><strong>Natural Splits:</strong> Large tiers are intelligently divided at natural score gaps</li>
          <li><strong>Adaptive:</strong> Works regardless of your scoring scale or number of players</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h4>💡 Why This Matters</h4>
        <p>
          This approach creates tiers that truly reflect the <em>relative</em> differences in your preferences, 
          not just arbitrary score ranges. Players in the same tier have genuinely similar value according 
          to your ranking choices.
        </p>
      </div>

      <div className={styles.section}>
        <h4>⚙️ Display Settings</h4>
        <div className={styles.settingsGroup}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showPlayerScores}
              onChange={(e) => onToggleScores(e.target.checked)}
              className={styles.toggleCheckbox}
            />
            <span className={styles.toggleText}>Show player scores in rankings</span>
          </label>
          
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={psychoMode}
              onChange={(e) => onTogglePsychoMode(e.target.checked)}
              className={styles.toggleCheckbox}
            />
            <span className={styles.toggleText}>
              🤯 Hey! Thanks for reading this much. If you've made it here that means you care about fantasy, 
              check this checkbox to <strong>unlock the psycho variant</strong> in settings for the deepest possible 
              dive into your fantasy rankings. Have fun!
            </span>
          </label>
        </div>
      </div>


    </Modal>
  );
};

export default TieringInfoModal; 