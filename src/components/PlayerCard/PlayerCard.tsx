import React from 'react';
import styles from './PlayerCard.module.scss';

interface Player {
  id: string;
  name: string;
  position: string;
  team: string | null;
  college: string;
  yearsExp: number;
  age: number | null;
  score: number;
  playerHeadshotLink: string | null;
}

interface PlayerCardProps {
  player: Player;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'ranking' | 'final';
  rank?: number;
  isTopThree?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isSelected = false,
  onClick,
  variant = 'ranking',
  rank,
  isTopThree = false
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const placeholder = target.nextSibling as HTMLElement;
    if (placeholder) placeholder.style.display = 'flex';
  };

  if (variant === 'final') {
    return (
      <div className={`${styles.finalCard} ${isTopThree ? styles.topThree : ''}`}>
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
            <strong>#{rank}: {player.name}</strong>
            {player.team && (
              <div className={styles.teamName}>{player.team}</div>
            )}
            <small>
              {player.college} • {player.yearsExp} years exp • Age {player.age}
            </small>
          </div>
        </div>
        <div className={styles.playerScore}>
          <strong>Score: {player.score}</strong>
        </div>
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