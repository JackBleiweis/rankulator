// Utility functions for position display names

export const getPositionAbbreviation = (positionKey: string): string => {
  const abbreviations: Record<string, string> = {
    QB: 'QB',
    RB: 'RB', 
    WR: 'WR',
    TE: 'TE'
  };
  
  return abbreviations[positionKey] || positionKey;
};

export const getDisplayName = (positionKey: string, fullName: string, isMobile: boolean = false): string => {
  return isMobile ? getPositionAbbreviation(positionKey) : fullName;
}; 