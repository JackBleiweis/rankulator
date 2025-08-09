import React, { useState } from 'react';
import PlayerCard from '../PlayerCard/PlayerCard';
import TieringInfoModal from '../TieringInfoModal/TieringInfoModal';
import DisclaimerModal from '../DisclaimerModal/DisclaimerModal';
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

interface PlayerWithTier extends Player {
  tier: number;
  tierLabel: string;
  zScore: number;
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
  const [showTieringModal, setShowTieringModal] = useState(false);
  const [showPlayerScores, setShowPlayerScores] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const createTiers = (players: Player[]): PlayerWithTier[] => {
    if (players.length === 0) return [];
    
    // Calculate z-scores for all players
    const scores = players.map(p => p.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate z-scores and add to players
    const playersWithZScores = players.map(player => ({
      ...player,
      zScore: stdDev === 0 ? 0 : (player.score - mean) / stdDev
    }));
    
    // Sort by z-score (highest first)
    const sortedPlayers = [...playersWithZScores].sort((a, b) => b.zScore - a.zScore);
    
          // Tier configuration with z-score thresholds
      const TIER_CONFIG = [
        { label: '🏆 Elite', minZ: 1.0, maxZ: Infinity, softCap: 4 },
        { label: '🥇 Tier 1', minZ: 0.3, maxZ: 1.0, softCap: 8 },
        { label: '👍 Tier 2', minZ: -0.3, maxZ: 0.3, softCap: 10 },
        { label: '👎 Tier 3', minZ: -1.0, maxZ: -0.3, softCap: 10 },
        { label: '💩 Tier 4', minZ: -Infinity, maxZ: -1.0, softCap: 12 }
      ];
    
    const FUZZY_THRESHOLD = 0.1; // For soft boundaries
    const playersWithTiers: PlayerWithTier[] = [];
    
    // First pass: assign initial tiers based on z-score thresholds
    for (const player of sortedPlayers) {
      let assignedTier = TIER_CONFIG.length; // Default to lowest tier
      
      for (let i = 0; i < TIER_CONFIG.length; i++) {
        const config = TIER_CONFIG[i];
        if (player.zScore >= config.minZ && player.zScore < config.maxZ) {
          assignedTier = i + 1;
          break;
        }
      }
      
      playersWithTiers.push({
        ...player,
        tier: assignedTier,
        tierLabel: TIER_CONFIG[assignedTier - 1]?.label || `Tier ${assignedTier}`,
        zScore: player.zScore
      });
    }
    
    // Second pass: apply fuzzy adjustments and soft caps
    const tierGroups = playersWithTiers.reduce((groups, player) => {
      if (!groups[player.tier]) {
        groups[player.tier] = [];
      }
      groups[player.tier].push(player);
      return groups;
    }, {} as Record<number, PlayerWithTier[]>);
    
    // Apply soft caps and fuzzy adjustments
    const finalPlayers: PlayerWithTier[] = [];
    
    for (let tierIndex = 0; tierIndex < TIER_CONFIG.length; tierIndex++) {
      const config = TIER_CONFIG[tierIndex];
      const tierNum = tierIndex + 1;
      const playersInTier = tierGroups[tierNum] || [];
      
      if (playersInTier.length === 0) continue;
      
      // Sort players in this tier by z-score
      playersInTier.sort((a, b) => b.zScore - a.zScore);
      
      // Check if tier exceeds soft cap
      if (playersInTier.length > config.softCap) {
        // Find natural break points using score gaps
        const scoreGaps = [];
        for (let i = 1; i < playersInTier.length; i++) {
          const gap = playersInTier[i-1].zScore - playersInTier[i].zScore;
          scoreGaps.push({ index: i, gap });
        }
        
        // Sort gaps to find the largest ones
        scoreGaps.sort((a, b) => b.gap - a.gap);
        
        // Use the largest gap to split the tier if it's significant
        if (scoreGaps.length > 0 && scoreGaps[0].gap > 0.2) {
          const splitIndex = scoreGaps[0].index;
          
          // Keep first group in current tier
          const firstGroup = playersInTier.slice(0, splitIndex);
          finalPlayers.push(...firstGroup.map(player => ({
            ...player,
            tier: tierNum,
            tierLabel: config.label
          })));
          
          // Move second group to next tier (if available)
          const secondGroup = playersInTier.slice(splitIndex);
          if (tierIndex + 1 < TIER_CONFIG.length) {
            const nextConfig = TIER_CONFIG[tierIndex + 1];
            finalPlayers.push(...secondGroup.map(player => ({
              ...player,
              tier: tierNum + 1,
              tierLabel: nextConfig.label
            })));
          } else {
            // If no next tier, keep in current tier
            finalPlayers.push(...secondGroup.map(player => ({
              ...player,
              tier: tierNum,
              tierLabel: config.label
            })));
          }
        } else {
          // No significant gap, keep all in current tier
          finalPlayers.push(...playersInTier.map(player => ({
            ...player,
            tier: tierNum,
            tierLabel: config.label
          })));
        }
      } else {
        // Tier is within soft cap, keep all players
        finalPlayers.push(...playersInTier.map(player => ({
          ...player,
          tier: tierNum,
          tierLabel: config.label
        })));
      }
    }
    
    // Apply fuzzy adjustments for players near thresholds
    for (let i = 0; i < finalPlayers.length; i++) {
      const player = finalPlayers[i];
      const currentTierConfig = TIER_CONFIG[player.tier - 1];
      
      if (!currentTierConfig) continue;
      
      // Check if player is near the upper threshold
      const distanceFromUpper = currentTierConfig.maxZ - player.zScore;
      if (distanceFromUpper <= FUZZY_THRESHOLD && distanceFromUpper > 0) {
        // Consider moving to higher tier if it exists and has room
        if (player.tier > 1) {
          const higherTierConfig = TIER_CONFIG[player.tier - 2];
          const playersInHigherTier = finalPlayers.filter(p => p.tier === player.tier - 1);
          
          if (playersInHigherTier.length < higherTierConfig.softCap) {
            player.tier = player.tier - 1;
            player.tierLabel = higherTierConfig.label;
          }
        }
      }
      
      // Check if player is near the lower threshold
      const distanceFromLower = player.zScore - currentTierConfig.minZ;
      if (distanceFromLower <= FUZZY_THRESHOLD && distanceFromLower > 0) {
        // Consider moving to lower tier if it exists and has room
        if (player.tier < TIER_CONFIG.length) {
          const lowerTierConfig = TIER_CONFIG[player.tier];
          const playersInLowerTier = finalPlayers.filter(p => p.tier === player.tier + 1);
          
          if (playersInLowerTier.length < lowerTierConfig.softCap) {
            player.tier = player.tier + 1;
            player.tierLabel = lowerTierConfig.label;
          }
        }
      }
    }
    
    // Sort by tier first, then by z-score within each tier
    return finalPlayers.sort((a, b) => {
      if (a.tier !== b.tier) {
        return a.tier - b.tier;
      }
      return b.zScore - a.zScore;
    });
  };

  // Share functionality
  const handleShare = async () => {
    const tierGroups = tieredPlayers.reduce((groups, player) => {
      if (!groups[player.tier]) {
        groups[player.tier] = [];
      }
      groups[player.tier].push(player);
      return groups;
    }, {} as Record<number, PlayerWithTier[]>);

    let shareText =  "I just created my custom fantasy rankings at https://rankulator.com! Check it out!"

    try {
      await navigator.clipboard.writeText(shareText);
      setShareMessage('Share link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (err) {
      setShareMessage('Failed to copy to clipboard');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  // Download CSV functionality
  const handleDownloadCSV = () => {
    const tierGroups = tieredPlayers.reduce((groups, player) => {
      if (!groups[player.tier]) {
        groups[player.tier] = [];
      }
      groups[player.tier].push(player);
      return groups;
    }, {} as Record<number, PlayerWithTier[]>);

    let csvContent = 'Rank,Player Name,Team,Tier,Tier Label,Score,College,Years Experience,Age\n';
    
    let overallRank = 1;
    Object.entries(tierGroups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([tierNum, playersInTier]) => {
        playersInTier.forEach((player) => {
          csvContent += `${overallRank},${player.name},"${player.team || 'N/A'}",${player.tier},"${player.tierLabel}",${player.score},"${player.college}",${player.yearsExp},${player.age || 'N/A'}\n`;
          overallRank++;
        });
      });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedPosition}_Rankings_Rankulator.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <h4 className={`${styles.tierLabel} ${styles[`tier${tierNum}`]}`}>
                  {playersInTier[0].tierLabel}
                </h4>
                <span className={styles.tierCount}>
                  ({playersInTier.length} player{playersInTier.length !== 1 ? 's' : ''})
                </span>
              </div>
              
              <div className={styles.tierPlayers}>
                {playersInTier.map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    variant="final"
                    tier={player.tier}
                    tierLabel={player.tierLabel}
                    isElite={player.tier === 1}
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
      />
      
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />
    </div>
  );
};

export default FinalRankings; 