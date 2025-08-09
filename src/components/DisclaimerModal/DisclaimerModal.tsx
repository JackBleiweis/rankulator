import React from 'react';
import Modal from '../Modal/Modal';
import styles from './DisclaimerModal.module.scss';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚠️ Read The Disclaimer"
    >
      <div className={styles.section}>
        <h4>🎯 About Your Rankings</h4>
        <p>
          <strong>These rankings are not meant to be exact or definitive.</strong> They reflect your personal preferences 
          based on the choices you made during the ranking process. Your results
          should be used as a starting point for your fantasy decisions, not as gospel truth.
        </p>
      </div>

      <div className={styles.section}>
        <h4>📊 Why Your Rankings Might Surprise You</h4>
        <div className={styles.surpriseFactors}>
          <div className={styles.factor}>
            <strong>🎲 Batch Randomness:</strong> Some players appeared in easier or harder batches to choose from
          </div>
          <div className={styles.factor}>
            <strong>🧠 Subconscious Bias:</strong> You might have unconscious preferences you didn't realize
          </div>
          <div className={styles.factor}>
            <strong>🎭 Context Changes:</strong> Your opinions may shift based on surrounding player choices
          </div>
        </div>
      </div>


      <div className={styles.finalNote}>
        <p>
          <strong>Bottom Line:</strong> Rankulator helps you discover your own preferences and biases. 
          The real value isn't in the final order, but in understanding <em>how you think</em> about these players!
        </p>
      </div>
    </Modal>
  );
};

export default DisclaimerModal; 