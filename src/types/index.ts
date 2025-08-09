// Common interfaces used across the application

export interface Player {
  id: string;
  name: string;
  position: string;
  team: string | null;
  college: string;
  yearsExp: number;
  age: number | null;
  active: boolean;
  searchRank: number;
  score: number;
  espnId: number | null;
  playerHeadshotLink: string | null;
  zScore?: number;
}

export interface PlayerWithTier extends Player {
  tier: number;
  tierLabel: string;
  zScore: number;
}

export type GamePhase = 'position-select' | 'loading' | 'ranking' | 'complete'; 