import { Player, PlayerWithTier } from '../types';
import { calculateZScores } from '../utils/statistics';

// Tier configuration with z-score thresholds
export const TIER_CONFIG = [
  { label: '🏆 Elite', minZ: 1.0, maxZ: Infinity, softCap: 4 },
  { label: '🥇 Tier 1', minZ: 0.3, maxZ: 1.0, softCap: 8 },
  { label: '👍 Tier 2', minZ: -0.3, maxZ: 0.3, softCap: 10 },
  { label: '👎 Tier 3', minZ: -1.0, maxZ: -0.3, softCap: 10 },
  { label: '💩 Tier 4', minZ: -Infinity, maxZ: -1.0, softCap: 12 }
];

const FUZZY_THRESHOLD = 0.1; // For soft boundaries

export const createTiers = (players: Player[]): PlayerWithTier[] => {
  if (players.length === 0) return [];
  
  // Calculate z-scores for all players
  const scores = players.map(p => p.score);
  const { zScores } = calculateZScores(scores);
  
  // Add z-scores to players and sort by z-score (highest first)
  const playersWithZScores = players.map((player, index) => ({
    ...player,
    zScore: zScores[index]
  }));
  
  const sortedPlayers = [...playersWithZScores].sort((a, b) => b.zScore - a.zScore);
  
  const playersWithTiers: PlayerWithTier[] = [];
  
  // First pass: assign initial tiers based on z-score thresholds
  for (const player of sortedPlayers) {
    let assignedTier = TIER_CONFIG.length; // Default to lowest tier
    
    for (let i = 0; i < TIER_CONFIG.length; i++) {
      const tier = TIER_CONFIG[i];
      if (player.zScore >= tier.minZ && player.zScore < tier.maxZ) {
        assignedTier = i + 1;
        break;
      }
    }
    
    playersWithTiers.push({
      ...player,
      tier: assignedTier,
      tierLabel: TIER_CONFIG[assignedTier - 1]?.label || 'Unranked'
    });
  }
  
  // Second pass: apply fuzzy boundaries and soft caps
  const tierCounts: Record<number, number> = {};
  
  // Count players in each tier
  playersWithTiers.forEach(player => {
    tierCounts[player.tier] = (tierCounts[player.tier] || 0) + 1;
  });
  
  // Apply soft caps and fuzzy adjustments
  for (let tierNum = 1; tierNum <= TIER_CONFIG.length; tierNum++) {
    const tierConfig = TIER_CONFIG[tierNum - 1];
    const playersInTier = playersWithTiers.filter(p => p.tier === tierNum);
    
    if (playersInTier.length > tierConfig.softCap) {
      // Sort players in this tier by z-score
      playersInTier.sort((a, b) => b.zScore - a.zScore);
      
      // Move excess players to next tier
      const excess = playersInTier.length - tierConfig.softCap;
      const playersToMove = playersInTier.slice(-excess);
      
      playersToMove.forEach(player => {
        const playerIndex = playersWithTiers.findIndex(p => p.id === player.id);
        if (playerIndex !== -1 && player.tier < TIER_CONFIG.length) {
          playersWithTiers[playerIndex].tier = player.tier + 1;
          playersWithTiers[playerIndex].tierLabel = TIER_CONFIG[player.tier]?.label || 'Unranked';
        }
      });
    }
  }
  
  // Third pass: apply fuzzy boundaries for players near thresholds
  playersWithTiers.forEach((player, index) => {
    if (player.tier < TIER_CONFIG.length) {
      const currentTierConfig = TIER_CONFIG[player.tier - 1];
      const nextTierConfig = TIER_CONFIG[player.tier];
      
      // Check if player is close to tier boundary
      if (Math.abs(player.zScore - currentTierConfig.minZ) <= FUZZY_THRESHOLD) {
        // Consider moving to adjacent tier based on local context
        const nearbyPlayers = playersWithTiers.slice(Math.max(0, index - 2), index + 3);
        const avgZScore = nearbyPlayers.reduce((sum, p) => sum + p.zScore, 0) / nearbyPlayers.length;
        
        if (Math.abs(player.zScore - avgZScore) > FUZZY_THRESHOLD) {
          // Player is an outlier, consider tier adjustment
          if (player.zScore < avgZScore && player.tier < TIER_CONFIG.length) {
            const playerIndex = playersWithTiers.findIndex(p => p.id === player.id);
            if (playerIndex !== -1) {
              playersWithTiers[playerIndex].tier = player.tier + 1;
              playersWithTiers[playerIndex].tierLabel = nextTierConfig?.label || 'Unranked';
            }
          }
        }
      }
    }
  });
  
  return playersWithTiers;
}; 