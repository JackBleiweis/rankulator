import React, { useState } from 'react';
import PlayerCard from '../PlayerCard/PlayerCard';
import TieringInfoModal from '../TieringInfoModal/TieringInfoModal';
import DisclaimerModal from '../DisclaimerModal/DisclaimerModal';
import { Player, PlayerWithTier } from '../../types';
import { createTiers } from '../../logic/tieringLogic';
import { generateShareText, generateCSVContent, downloadCSV, copyToClipboard } from '../../logic/shareLogic';
import styles from './FinalRankings.module.scss';

interface FinalRankingsProps {
  players: Player[];
  selectedPosition: string;
  totalBatches: number;
  onReset: () => void;
  psychoMode: boolean;
  onTogglePsychoMode: (enabled: boolean) => void;
}

const FinalRankings: React.FC<FinalRankingsProps> = ({
  players,
  selectedPosition,
  totalBatches,
  onReset,
  psychoMode,
  onTogglePsychoMode
}) => {
  const [showTieringModal, setShowTieringModal] = useState(false);
  const [showPlayerScores, setShowPlayerScores] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Share functionality
  const handleShare = async () => {
    const tieredPlayers = createTiers(players);
    const shareText = generateShareText(tieredPlayers, selectedPosition, totalBatches);
    
    const success = await copyToClipboard(shareText);
    if (success) {
      setShareMessage('Share link copied to clipboard!');
    } else {
      setShareMessage('Failed to copy to clipboard');
    }
    setTimeout(() => setShareMessage(''), 3000);
  };

  // Download CSV functionality
  const handleDownloadCSV = () => {
    const tieredPlayers = createTiers(players);
    const csvContent = generateCSVContent(tieredPlayers);
    downloadCSV(csvContent, selectedPosition);
  };

  const tieredPlayers = createTiers(players);
  
  // Group players by tier for display
  const tierGroups = tieredPlayers.reduce((groups, player) => {
    if (!groups[player.tier]) {
      groups[player.tier] = [];
    }
    groups[player.tier].push(player);
    return groups;
  }, {} as Record<number, PlayerWithTier[]>);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>
          <span className={styles.titleIcon}>🏆</span>
          <span className={styles.titleText}>Rankulator</span>
        </h1>
        <div className={styles.completionBadge}>
          <span className={styles.badgeIcon}>✅</span>
          <span className={styles.badgeText}>Game Complete!</span>
          <span className={styles.badgeDetail}>({totalBatches} batches)</span>
        </div>
      </div>
      
      <div className={styles.buttonSection}>
        <button 
          className={styles.infoButton}
          onClick={() => setShowTieringModal(true)}
        >
          📊 Tiering Info & Player Scores
        </button>
        
        <button 
          className={styles.disclaimerButton}
          onClick={() => setShowDisclaimerModal(true)}
        >
          ⚠️ Read The Disclaimer
        </button>
        <button 
          className={styles.shareButton}
          onClick={handleShare}
        >
          📋 Share Rankings
        </button>
        <button 
          className={styles.downloadButton}
          onClick={handleDownloadCSV}
        >
          📥 Download CSV
        </button>
      </div>
      
      {shareMessage && (
        <div className={styles.shareMessage}>
          {shareMessage}
        </div>
      )}
      
      <div className={styles.rankingsList}>
        {Object.entries(tierGroups)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([tierNum, playersInTier]) => (
            <div key={tierNum} className={styles.tierGroup}>
              <div className={styles.tierHeader}>
                <h2 className={`${styles.tierLabel} ${styles[`tier${tierNum}`]}`}>
                  {playersInTier[0].tierLabel}
                </h2>
                <span className={styles.tierCount}>({playersInTier.length})</span>
              </div>
              
              <div className={styles.tierPlayers}>
                {playersInTier.map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    variant="final"
                    rank={index + 1}
                    tier={player.tier}
                    tierLabel={player.tierLabel}
                    isElite={player.tier === 1}
                    isTopThree={index < 3}
                    showScore={showPlayerScores}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      <button onClick={onReset} className={styles.resetButton}>
        Rank Another Position
      </button>

      <TieringInfoModal
        isOpen={showTieringModal}
        onClose={() => setShowTieringModal(false)}
        showPlayerScores={showPlayerScores}
        onToggleScores={setShowPlayerScores}
        psychoMode={psychoMode}
        onTogglePsychoMode={onTogglePsychoMode}
      />
      
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />
    </div>
  );
};

export default FinalRankings; 