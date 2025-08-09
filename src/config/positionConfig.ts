// Position configuration for different fantasy football positions
export const POSITION_CONFIG = {
  QB: { 
    name: 'Quarterbacks', 
    default: 16, 
    min: 8, 
    max: 32, 
    description: 'Essential QB rankings for your league'
  },
  RB: { 
    name: 'Running Backs', 
    default: 20, 
    min: 10, 
    max: 50, 
    description: 'Top RBs including handcuffs and sleepers'
  },
  WR: { 
    name: 'Wide Receivers', 
    default: 30, 
    min: 15, 
    max: 75, 
    description: 'Deep WR rankings for all roster spots'
  },
  TE: { 
    name: 'Tight Ends', 
    default: 12, 
    min: 6, 
    max: 32, 
    description: 'Key TEs for streaming and starting'
  }
} as const;

export type PositionKey = keyof typeof POSITION_CONFIG; 