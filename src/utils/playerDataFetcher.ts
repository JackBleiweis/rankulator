interface SleeperPlayer {
  player_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  position: string;
  fantasy_positions: string[];
  team: string | null;
  team_abbr: string | null;
  active: boolean;
  status: string;
  years_exp: number;
  age: number | null;
  height: string;
  weight: string;
  college: string;
  injury_status: string | null;
  search_rank: number;
  espn_id: number | null;
}

interface RankulatorPlayer {
  id: string;
  name: string;
  position: string;
  team: string | null;
  college: string;
  yearsExp: number;
  age: number | null;
  active: boolean;
  searchRank: number;
  score: number; // For ranking system
  espnId: number | null;
  playerHeadshotLink: string | null;
}

export class PlayerDataFetcher {
  
  /**
   * Load players from local JSON file
   */
  static async loadPlayersFromFile(): Promise<RankulatorPlayer[]> {
    try {
      console.log('Loading players from local data file...');
      const response = await fetch('/data/rankulator_players.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const players: RankulatorPlayer[] = await response.json();
      console.log(`Loaded ${players.length} players from local file`);
      
      return players;
    } catch (error) {
      console.error('Error loading player data from file:', error);
      throw error;
    }
  }

  /**
   * Load players from position-specific JSON file
   */
  static async loadPlayersByPositionFile(position: string): Promise<RankulatorPlayer[]> {
    try {
      const filename = `${position.toLowerCase()}_all_players.json`;
      console.log(`Loading ${position} players from ${filename}...`);
      
      const response = await fetch(`/data/${filename}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const players: RankulatorPlayer[] = await response.json();
      console.log(`Loaded ${players.length} ${position} players from ${filename}`);
      
      return players;
    } catch (error) {
      console.error(`Error loading ${position} players from file:`, error);
      throw error;
    }
  }

  /**
   * Load raw Sleeper data and process it with enhanced fields
   */
  static async loadAndProcessRawData(): Promise<RankulatorPlayer[]> {
    try {
      console.log('Loading raw Sleeper data...');
      const response = await fetch('/data/sleeper_raw_data.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData: Record<string, SleeperPlayer> = await response.json();
      console.log(`Loaded ${Object.keys(rawData).length} players from raw Sleeper data`);
      
      return this.convertToRankulatorFormat(rawData);
    } catch (error) {
      console.error('Error loading raw Sleeper data:', error);
      throw error;
    }
  }

  /**
   * Convert Sleeper player format to our enhanced app format
   */
  static convertToRankulatorFormat(sleeperData: Record<string, SleeperPlayer>): RankulatorPlayer[] {
    return Object.values(sleeperData)
      .filter(player => 
        player.full_name && 
        player.position && 
        player.active && 
        player.status === 'Active' &&
        ['QB', 'RB', 'WR', 'TE'].includes(player.position)
      )
      .map(player => ({
        id: player.player_id,
        name: player.full_name,
        position: player.position,
        team: player.team || null, // Use the team field from raw data
        college: player.college || 'Unknown',
        yearsExp: player.years_exp || 0,
        age: player.age,
        active: player.active,
        searchRank: player.search_rank || 9999999,
        score: 0, // Initialize ranking score
        espnId: player.espn_id || null,
        playerHeadshotLink: player.espn_id 
          ? `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.espn_id}.png&w=350&h=254`
          : null
      }))
      .sort((a, b) => a.searchRank - b.searchRank); // Sort by fantasy relevance
  }
  
  /**
   * Filter players by position
   */
  static filterByPosition(players: RankulatorPlayer[], position: string): RankulatorPlayer[] {
    return players.filter(player => player.position === position);
  }
  
  /**
   * Get top N players by position (based on search rank)
   */
  static getTopPlayersByPosition(players: RankulatorPlayer[], position: string, count: number): RankulatorPlayer[] {
    return this.filterByPosition(players, position)
      .slice(0, count);
  }
  
  /**
   * Main function to load and return QB data for ranking using position-specific file
   */
  static async getQBsForRanking(count: number = 32): Promise<RankulatorPlayer[]> {
    try {
      const qbs = await this.getPlayersByPosition('QB', count);
      
      console.log(`Returning top ${qbs.length} QBs for ranking:`, qbs.map(qb => qb.name));
      
      return qbs;
    } catch (error) {
      console.error('Error getting QBs for ranking:', error);
      throw error;
    }
  }

  /**
   * Enhanced function to get QBs with fresh data processing
   */
  static async getQBsForRankingFromRawData(count: number = 32): Promise<RankulatorPlayer[]> {
    try {
      const allPlayers = await this.loadAndProcessRawData();
      const qbs = this.getTopPlayersByPosition(allPlayers, 'QB', count);
      
      console.log(`Returning top ${qbs.length} QBs for ranking from raw data:`, qbs.map(qb => qb.name));
      
      return qbs;
    } catch (error) {
      console.error('Error getting QBs from raw data:', error);
      throw error;
    }
  }
  
  /**
   * Get players for any position using position-specific files
   */
  static async getPlayersByPosition(position: string, count?: number): Promise<RankulatorPlayer[]> {
    try {
      const players = await this.loadPlayersByPositionFile(position);
      
      if (count) {
        return players.slice(0, count);
      }
      
      return players;
    } catch (error) {
      console.error(`Error getting ${position} players:`, error);
      throw error;
    }
  }
  
  /**
   * Get summary of available players by position
   */
  static async getPlayerSummary(): Promise<{totalPlayers: number, byPosition: Record<string, number>}> {
    try {
      const response = await fetch('/data/player_summary.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const summary = await response.json();
      return summary;
    } catch (error) {
      console.error('Error loading player summary:', error);
      throw error;
    }
  }

  /**
   * Utility function to regenerate and download enhanced player data
   */
  static async regenerateEnhancedPlayerData(): Promise<void> {
    try {
      console.log('Regenerating enhanced player data...');
      
      // Process raw data with new fields
      const enhancedPlayers = await this.loadAndProcessRawData();
      
      // Create downloadable file with enhanced data
      const jsonData = JSON.stringify(enhancedPlayers, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'enhanced_rankulator_players.json';
      link.click();
      
      URL.revokeObjectURL(url);
      console.log('Enhanced player data downloaded successfully!');
      
      // Log sample of enhanced data
      const qbs = this.filterByPosition(enhancedPlayers, 'QB').slice(0, 5);
      console.log('Sample enhanced QB data:', qbs);
      
    } catch (error) {
      console.error('Error regenerating enhanced player data:', error);
    }
  }

  /**
   * Separate players by position and create individual JSON files
   * Filters out players with null teams
   */
  static async separatePlayersByPosition(): Promise<void> {
    try {
      console.log('Loading raw Sleeper data to separate by position...');
      const response = await fetch('/data/sleeper_raw_data.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData: Record<string, SleeperPlayer> = await response.json();
      console.log(`Loaded ${Object.keys(rawData).length} players from raw Sleeper data`);
      
      // Filter and process players
      const processedPlayers = Object.values(rawData)
        .filter(player => 
          player.full_name && 
          player.position && 
          player.active && 
          player.status === 'Active' &&
          player.team !== null && // Filter out players with null teams
          ['QB', 'RB', 'WR', 'TE'].includes(player.position)
        )
        .map(player => ({
          id: player.player_id,
          name: player.full_name,
          position: player.position,
          team: player.team,
          college: player.college || 'Unknown',
          yearsExp: player.years_exp || 0,
          age: player.age,
          active: player.active,
          searchRank: player.search_rank || 9999999,
          score: 0,
          espnId: player.espn_id || null,
          playerHeadshotLink: player.espn_id 
            ? `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.espn_id}.png&w=350&h=254`
            : null
        }));

      // Group players by position
      const playersByPosition = processedPlayers.reduce((groups, player) => {
        if (!groups[player.position]) {
          groups[player.position] = [];
        }
        groups[player.position].push(player);
        return groups;
      }, {} as Record<string, RankulatorPlayer[]>);

      // Sort each position by search rank
      Object.keys(playersByPosition).forEach(position => {
        playersByPosition[position].sort((a, b) => a.searchRank - b.searchRank);
      });

      console.log('Players by position summary:');
      Object.entries(playersByPosition).forEach(([position, players]) => {
        console.log(`${position}: ${players.length} players`);
      });

      // Create and download separate files for each position
      for (const [position, players] of Object.entries(playersByPosition)) {
        const filename = `${position.toLowerCase()}_all_players.json`;
        const jsonData = JSON.stringify(players, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 100));
        
        URL.revokeObjectURL(url);
        console.log(`Downloaded ${filename} with ${players.length} players`);
      }

      console.log('All position-specific files generated successfully!');
      
    } catch (error) {
      console.error('Error separating players by position:', error);
    }
  }
}

export default PlayerDataFetcher; 