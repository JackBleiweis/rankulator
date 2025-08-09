import { GameSettings } from '../components/Settings/Settings';

// Preset configurations for different ranking intensities
export const PRESET_CONFIG = {
  quick: {
    name: 'Quick',
    icon: '⚡',
    description: '8 batches • 1-3 min',
    settings: {
      batchSize: 6,
      explorationBatches: 3,
      mixedBatches: 2,
      refinementBatches: 3
    }
  },
  normal: {
    name: 'Normal',
    icon: '⚖️',
    description: '24 batches • 3-6 min',
    settings: {
      batchSize: 6,
      explorationBatches: 5,
      mixedBatches: 5,
      refinementBatches: 5
    }
  },
  extensive: {
    name: 'Extensive',
    icon: '🔍',
    description: '35 batches • 6-10 min',
    settings: {
      batchSize: 6,
      explorationBatches: 8,
      mixedBatches: 8,
      refinementBatches: 8
    }
  },
  psycho: {
    name: 'Psycho',
    icon: '🤯',
    description: '64 batches • 15-20 min',
    settings: {
      batchSize: 8,
      explorationBatches: 20,
      mixedBatches: 22,
      refinementBatches: 22
    }
  }
} as const;

export type PresetKey = keyof typeof PRESET_CONFIG;

// Type helper for preset settings
export type PresetSettings = {
  [K in PresetKey]: {
    name: string;
    icon: string;
    description: string;
    settings: GameSettings;
  }
}; 