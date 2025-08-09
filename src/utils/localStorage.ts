// Utility functions for localStorage operations

export const hasUserVisitedBefore = (): boolean => {
  return localStorage.getItem('rankulator_visited') !== null;
};

export const markUserAsVisited = (): void => {
  localStorage.setItem('rankulator_visited', 'true');
}; 