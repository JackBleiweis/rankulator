import React, { useState, useEffect } from 'react';
import PlayerDataFetcher from '../../utils/playerDataFetcher';
import styles from './PlayerDataTest.module.scss';

interface PlayerDataTestProps {
  onQBDataLoaded?: (qbs: any[]) => void;
}

const PlayerDataTest: React.FC<PlayerDataTestProps> = ({ onQBDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [qbCount, setQbCount] = useState(0);
  const [summary, setSummary] = useState<any>(null);

  // Load summary on component mount
  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const summaryData = await PlayerDataFetcher.getPlayerSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  const handleGetQBs = async () => {
    setLoading(true);
    setStatus('Loading top 32 QBs from local data...');
    
    try {
      const qbs = await PlayerDataFetcher.getQBsForRanking(32);
      setQbCount(qbs.length);
      setStatus(`✅ Loaded ${qbs.length} QBs ready for ranking!`);
      
      // Log first few QBs for verification
      console.log('Top 10 QBs:', qbs.slice(0, 10));
      
      // Pass data back to parent if callback provided
      if (onQBDataLoaded) {
        onQBDataLoaded(qbs);
      }
      
    } catch (error) {
      setStatus(`❌ Error loading QBs: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateData = async () => {
    setLoading(true);
    setStatus('Regenerating enhanced player data with ESPN IDs, teams, and headshots...');
    
    try {
      await PlayerDataFetcher.regenerateEnhancedPlayerData();
      setStatus('✅ Enhanced player data generated! Check your downloads for "enhanced_rankulator_players.json"');
    } catch (error) {
      setStatus(`❌ Error regenerating data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEnhancedQBs = async () => {
    setLoading(true);
    setStatus('Testing QBs from raw data with enhanced fields...');
    
    try {
      const qbs = await PlayerDataFetcher.getQBsForRankingFromRawData(10);
      setQbCount(qbs.length);
      setStatus(`✅ Loaded ${qbs.length} enhanced QBs! Check console for details.`);
      
      // Log enhanced QB data
      console.log('Enhanced QB data sample:', qbs);
      
    } catch (error) {
      setStatus(`❌ Error loading enhanced QBs: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClassName = () => {
    if (!status) return '';
    return status.includes('❌') ? styles.error : styles.success;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🏈 NFL Player Data Loader</h3>
      <p className={styles.description}>Load QB data from local files for ranking</p>
      
      {summary && (
        <div className={styles.summary}>
          <strong>Available Players:</strong> {summary.totalPlayers} total
          <br />
          QB: {summary.byPosition.QB} | RB: {summary.byPosition.RB} | WR: {summary.byPosition.WR} | TE: {summary.byPosition.TE}
        </div>
      )}
      
      <div className={styles.buttonContainer}>
        <button 
          onClick={handleGetQBs}
          disabled={loading}
          className={styles.loadButton}
          style={{ marginRight: '10px', marginBottom: '10px' }}
        >
          {loading ? 'Loading...' : 'Load Top 32 QBs for Ranking'}
        </button>
        
        <button 
          onClick={handleRegenerateData}
          disabled={loading}
          className={styles.loadButton}
          style={{ 
            backgroundColor: '#FF9800', 
            marginRight: '10px', 
            marginBottom: '10px'
          }}
        >
          {loading ? 'Regenerating...' : 'Regenerate Enhanced Data'}
        </button>
        
        <button 
          onClick={handleTestEnhancedQBs}
          disabled={loading}
          className={styles.loadButton}
          style={{ 
            backgroundColor: '#9C27B0', 
            marginBottom: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test Enhanced QBs'}
        </button>
      </div>
      
      {status && (
        <div className={`${styles.status} ${getStatusClassName()}`}>
          {status}
        </div>
      )}
      
      {qbCount > 0 && (
        <div className={styles.readyMessage}>
          Ready to rank {qbCount} quarterbacks!
        </div>
      )}
    </div>
  );
};

export default PlayerDataTest; 