import React from 'react';
import Modal from '../Modal/Modal';
import StepComponent from '../common/StepComponent/StepComponent';
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
      title="🏈 Welcome to Rankulator!"
      maxWidth="600px"
    >
      <div className={styles.welcomeContent}>
        <div className={styles.howItWorks}>
          <h4>🚀 How It Works</h4>
          <div className={styles.stepsList}>
            <StepComponent
              stepNumber={1}
              title="Choose Your Position"
              description="Select QB, RB, WR, or TE to start ranking"
            />
            <StepComponent
              stepNumber={2}
              title="Make Simple Choices"
              description="We'll show you small batches of players - just pick the ones you like"
            />
            <StepComponent
              stepNumber={3}
              title="Get Smart Tiers"
              description="Our algorithm creates statistically-based tiers that reflect your true preferences"
            />
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