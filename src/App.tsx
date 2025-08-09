import React, { useState, useEffect } from 'react';
import PlayerDataFetcher from './utils/playerDataFetcher';
import BatchProgress from './components/BatchProgress/BatchProgress';
import PositionSelector from './components/PositionSelector/PositionSelector';
import PlayerCard from './components/PlayerCard/PlayerCard';
import FinalRankings from './components/FinalRankings/FinalRankings';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import RankulatorTitle from './components/RankulatorTitle/RankulatorTitle';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import { GameSettings } from './components/Settings/Settings';
import styles from './App.module.scss';

interface Player {
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
}

type GamePhase = 'position-select' | 'loading' | 'ranking' | 'complete';

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('position-select');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [psychoMode, setPsychoMode] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  // Check if this is the user's first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('rankulator_visited');
    if (!hasVisitedBefore) {
      setShowWelcomeModal(true);
    }
  }, []);

  // Handle welcome modal close
  const handleWelcomeClose = () => {
    localStorage.setItem('rankulator_visited', 'true');
    setShowWelcomeModal(false);
  };
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentBatch, setCurrentBatch] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Game settings with defaults
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    batchSize: 6,
    explorationBatches: 5,
    mixedBatches: 5,
    refinementBatches: 5
  });
  
  // Derived values from settings
  const BATCH_SIZE = gameSettings.batchSize;
  const EXPLORATION_BATCHES = gameSettings.explorationBatches;
  const MIXED_BATCHES = gameSettings.mixedBatches;
  const REFINEMENT_BATCHES = gameSettings.refinementBatches;
  const TOTAL_BATCHES = EXPLORATION_BATCHES + MIXED_BATCHES + REFINEMENT_BATCHES;

  // Handle position selection and load player data
  const handlePositionSelect = async (position: string, playerCount: number, newGameSettings: GameSettings) => {
    setSelectedPosition(position);
    setGamePhase('loading');
    setLoading(true);
    setError('');
    
    // Update game settings from preset selection
    setGameSettings(newGameSettings);
    
    try {
      // Load players from position-specific file with custom count
      const loadedPlayers = await PlayerDataFetcher.getPlayersByPosition(position, playerCount);
      
      const initializedPlayers = loadedPlayers.map(player => ({
        ...player,
        score: 0
      }));
      
      setPlayers(initializedPlayers);
      setGamePhase('ranking');
      generateBatch(initializedPlayers);
      
    } catch (err) {
      setError(`Failed to load ${position} data: ${err}`);
      setGamePhase('position-select');
    } finally {
      setLoading(false);
    }
  };

  // Get current batch phase
  const getCurrentBatchPhase = () => {
    if (batchCount < EXPLORATION_BATCHES) return 'exploration';
    if (batchCount < EXPLORATION_BATCHES + MIXED_BATCHES) return 'mixed';
    if (batchCount < EXPLORATION_BATCHES + MIXED_BATCHES + REFINEMENT_BATCHES) return 'refinement';
    return 'complete';
  };

  // Generate intelligent batch
  const generateBatch = (playerList: Player[]) => {
    const phase = getCurrentBatchPhase();
    let batch: Player[] = [];

    if (phase === 'exploration') {
      const shuffled = [...playerList].sort(() => 0.5 - Math.random());
      batch = shuffled.slice(0, Math.min(BATCH_SIZE, playerList.length));
    } else {
      const sortedByScore = [...playerList].sort((a, b) => b.score - a.score);
      const randomPercentage = phase === 'mixed' ? 0.3 : 0.1;
      
      if (Math.random() < randomPercentage) {
        const shuffled = [...playerList].sort(() => 0.5 - Math.random());
        batch = shuffled.slice(0, Math.min(BATCH_SIZE, playerList.length));
      } else {
        batch = generateScoreBasedBatch(sortedByScore);
      }
    }

    setCurrentBatch(batch);
    setSelectedPlayers([]);
  };

  // Generate score-based batch
  const generateScoreBasedBatch = (sortedPlayers: Player[]): Player[] => {
    if (sortedPlayers.length <= BATCH_SIZE) return sortedPlayers;

    const startIndex = Math.floor(Math.random() * Math.max(1, sortedPlayers.length - BATCH_SIZE + 1));
    let batch = sortedPlayers.slice(startIndex, startIndex + BATCH_SIZE);

    if (batch.length < BATCH_SIZE) {
      const remaining = BATCH_SIZE - batch.length;
      const availablePlayers = sortedPlayers.filter(p => !batch.includes(p));
      const shuffledRemaining = availablePlayers.sort(() => 0.5 - Math.random());
      batch = [...batch, ...shuffledRemaining.slice(0, remaining)];
    }

    return batch.sort(() => 0.5 - Math.random());
  };

  // Handle player selection
  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  // Submit batch with pairwise scoring
  const submitBatch = () => {
    const updatedPlayers = players.map(player => {
      if (currentBatch.some(bp => bp.id === player.id)) {
        const isSelected = selectedPlayers.includes(player.id);
        const selectedCount = selectedPlayers.length;
        const notSelectedCount = currentBatch.length - selectedCount;
        
        let scoreChange = 0;
        if (isSelected) {
          scoreChange = notSelectedCount;
        } else {
          scoreChange = -selectedCount;
        }
        
        return { ...player, score: player.score + scoreChange };
      }
      return player;
    });

    setPlayers(updatedPlayers);
    const newBatchCount = batchCount + 1;
    setBatchCount(newBatchCount);

    if (newBatchCount >= TOTAL_BATCHES) {
      setGamePhase('complete');
    } else {
      generateBatch(updatedPlayers);
    }
  };

  // Reset game
  const resetGame = () => {
    setGamePhase('position-select');
    setSelectedPosition('');
    setPlayers([]);
    setCurrentBatch([]);
    setSelectedPlayers([]);
    setBatchCount(0);
    setError('');
  };

  // Render appropriate phase
  if (gamePhase === 'position-select') {
    return (
      <div className={styles.app}>
        <PositionSelector
          onPositionSelect={handlePositionSelect}
          loading={loading}
          selectedPosition={selectedPosition}
          error={error}
          psychoModeUnlocked={psychoMode}
        />
        <WelcomeModal 
          isOpen={showWelcomeModal}
          onClose={handleWelcomeClose}
        />
      </div>
    );
  }

  if (gamePhase === 'loading') {
    return (
      <div className={styles.app}>
        <LoadingScreen selectedPosition={selectedPosition} />
        <WelcomeModal 
          isOpen={showWelcomeModal}
          onClose={handleWelcomeClose}
        />
      </div>
    );
  }

  if (gamePhase === 'complete') {
    return (
      <div className={styles.app}>
        <FinalRankings
          players={players}
          selectedPosition={selectedPosition}
          totalBatches={TOTAL_BATCHES}
          onReset={resetGame}
          psychoMode={psychoMode}
          onTogglePsychoMode={setPsychoMode}
        />
        <WelcomeModal 
          isOpen={showWelcomeModal}
          onClose={handleWelcomeClose}
        />
      </div>
    );
  }

  // Active ranking phase
  return (
    <div className={styles.app}>
    <div className={styles.rankingContainer}>
      <div className={styles.rankingHeader}>
        <RankulatorTitle />
        <div className={styles.rankingTitleContainer}>
          <img 
            src="/golden-badgers-logo.png" 
            alt="Golden Badgers Logo"
            className={styles.logo}
          />
        </div>
      </div>
      
      <BatchProgress
        currentBatch={batchCount}
        totalBatches={TOTAL_BATCHES}
        currentPhase={getCurrentBatchPhase()}
        explorationBatches={EXPLORATION_BATCHES}
        mixedBatches={MIXED_BATCHES}
        refinementBatches={REFINEMENT_BATCHES}
      />

      <div className={styles.playersGrid}>
        {currentBatch.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedPlayers.includes(player.id)}
            onClick={() => togglePlayerSelection(player.id)}
            variant="ranking"
          />
        ))}
      </div>

      <div className={styles.batchActions}>
        <p><strong>Selected: {selectedPlayers.length} players</strong></p>
        <button 
          onClick={submitBatch}
          className={`${styles.submitButton} ${styles.enabled}`}
        >
          {selectedPlayers.length > 0 ? "Submit Selections" : "Skip Batch"}
        </button>
      </div>

      <div className={styles.gameControls}>
        <button onClick={resetGame} className={styles.startOverButton}>
          Start Over
        </button>
      </div>
    </div>
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={handleWelcomeClose}
      />
    </div>
  );
}

export default App;
