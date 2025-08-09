import { PlayerWithTier } from '../types';

export const generateShareText = (
  tieredPlayers: PlayerWithTier[],
  selectedPosition: string,
  totalBatches: number
): string => {
  const tierGroups = tieredPlayers.reduce((groups, player) => {
    if (!groups[player.tier]) {
      groups[player.tier] = [];
    }
    groups[player.tier].push(player);
    return groups;
  }, {} as Record<number, PlayerWithTier[]>);

  let shareText = `🏈 My ${selectedPosition} Rankings from Rankulator\n\n`;
  
  Object.entries(tierGroups)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([tierNum, playersInTier]) => {
      const tierLabel = playersInTier[0].tierLabel;
      shareText += `${tierLabel} (${playersInTier.length} players):\n`;
      playersInTier.forEach((player, index) => {
        shareText += `${index + 1}. ${player.name}${player.team ? ` (${player.team})` : ''} - Score: ${player.score}\n`;
      });
      shareText += '\n';
    });

  shareText += `Created with Rankulator after ${totalBatches} ranking batches`;
  return shareText;
};

export const generateCSVContent = (tieredPlayers: PlayerWithTier[]): string => {
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

  return csvContent;
};

export const downloadCSV = (csvContent: string, selectedPosition: string): void => {
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

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}; 