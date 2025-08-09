import React from 'react';
import Modal from '../Modal/Modal';
import styles from './WelcomeModal.module.scss';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🏈 Welcome!"
      maxWidth="600px"
    >
      <div className={styles.welcomeContent}>
        <div className={styles.howItWorks}>
          <h4>🚀 How It Works</h4>
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <div className={styles.stepContent}>
                <strong>Choose Your Position</strong>
                <p>Select QB, RB, WR, or TE to start ranking</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <div className={styles.stepContent}>
                <strong>Make Simple Choices</strong>
                <p>We'll show you small batches of players - just pick the ones you like</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <div className={styles.stepContent}>
                <strong>Get Smart Tiers</strong>
                <p>Our algorithm creates statistically-based tiers that reflect your true preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <button 
            className={styles.ctaButton}
            onClick={onClose}
          >
            🎯 Start Ranking Players
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal; 