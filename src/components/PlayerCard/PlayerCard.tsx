import React from 'react';
import { Player } from '../../types';
import styles from './PlayerCard.module.scss';

interface PlayerCardProps {
  player: Player;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'ranking' | 'final';
  rank?: number;
  isTopThree?: boolean;
  tier?: number;
  tierLabel?: string;
  isElite?: boolean;
  showScore?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isSelected = false,
  onClick,
  variant = 'ranking',
  rank,
  isTopThree = false,
  tier,
  tierLabel,
  isElite = false,
  showScore = true
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const placeholder = target.nextSibling as HTMLElement;
    if (placeholder) placeholder.style.display = 'flex';
  };

  if (variant === 'final') {
    return (
      <div className={`${styles.finalCard} ${isElite ? styles.elite : ''} ${tier ? styles[`tier${tier}`] : ''}`}>
        <div className={styles.playerInfo}>
          {player.playerHeadshotLink ? (
            <img 
              src={player.playerHeadshotLink} 
              alt={player.name}
              className={styles.finalHeadshot}
              onError={handleImageError}
            />
          ) : null}
          <div 
            className={`${styles.finalHeadshot} ${styles.error}`}
            style={{ display: player.playerHeadshotLink ? 'none' : 'flex' }}
          >
            🏈
          </div>
          
          <div className={styles.playerContent}>
            <strong>{player.name}</strong>
            {player.team && (
              <div className={styles.teamName}>{player.team}</div>
            )}
            <small>
              {player.college} • {player.yearsExp} years exp • Age {player.age}
            </small>
          </div>
        </div>
        {showScore && (
        <div className={styles.playerScore}>
          <strong>Score: {player.score}</strong>
        </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`${styles.rankingCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.cardContent}>
        {player.playerHeadshotLink ? (
          <img 
            src={player.playerHeadshotLink} 
            alt={player.name}
            className={styles.headshot}
            onError={handleImageError}
          />
        ) : null}
        <div 
          className={`${styles.headshot} ${styles.error}`}
          style={{ display: player.playerHeadshotLink ? 'none' : 'flex' }}
        >
          🏈
        </div>
        
        <div className={styles.playerDetails}>
          <strong>{player.name}</strong>
          {player.team && (
            <div className={styles.teamName}>{player.team}</div>
          )}
          <div className={styles.playerInfo}>
            {player.college} • {player.yearsExp} years exp • Age {player.age}
          </div>
        </div>
        
        <div className={styles.playerStats}>
          <strong>Score: {player.score}</strong>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard; 