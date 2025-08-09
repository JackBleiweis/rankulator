// Statistical utility functions

export interface ZScoreCalculation {
  mean: number;
  standardDeviation: number;
  zScores: number[];
}

export const calculateZScores = (scores: number[]): ZScoreCalculation => {
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);
  
  const zScores = scores.map(score => 
    standardDeviation === 0 ? 0 : (score - mean) / standardDeviation
  );
  
  return {
    mean,
    standardDeviation,
    zScores
  };
}; 