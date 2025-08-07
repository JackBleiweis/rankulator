import React from 'react';
import RankulatorTitle from '../RankulatorTitle/RankulatorTitle';
import styles from './LoadingScreen.module.scss';

interface LoadingScreenProps {
  selectedPosition: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ selectedPosition }) => {
  return (
    <div className={styles.container}>
      <RankulatorTitle />
      <div>
        <h2>Loading {selectedPosition} Players...</h2>
        <p>Please wait while we prepare your ranking session.</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 