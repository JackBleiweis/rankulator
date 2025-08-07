import React from 'react';
import PlayerCard from '../PlayerCard/PlayerCard';
import styles from './FinalRankings.module.scss';

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

interface FinalRankingsProps {
  players: Player[];
  selectedPosition: string;
  totalBatches: number;
  onReset: () => void;
}

const FinalRankings: React.FC<FinalRankingsProps> = ({
  players,
  selectedPosition,
  totalBatches,
  onReset
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={styles.container}>
      <h1>🏈 Rankulator - Final Rankings</h1>
      <h2>Game Complete! ({totalBatches} batches)</h2>
      <h3>Your {selectedPosition} Rankings:</h3>
      
      <div className={styles.rankingsList}>
        {sortedPlayers.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            variant="final"
            rank={index + 1}
            isTopThree={index < 3}
          />
        ))}
      </div>
      
      <button onClick={onReset} className={styles.resetButton}>
        Rank Another Position
      </button>
    </div>
  );
};

export default FinalRankings; 