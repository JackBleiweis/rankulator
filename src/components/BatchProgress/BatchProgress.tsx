import React from "react";
import styles from "./BatchProgress.module.scss";

interface BatchProgressProps {
  currentBatch: number;
  totalBatches: number;
  currentPhase: "exploration" | "mixed" | "refinement" | "complete";
  explorationBatches: number;
  mixedBatches: number;
  refinementBatches: number;
}

const BatchProgress: React.FC<BatchProgressProps> = ({
  currentBatch,
  totalBatches,
  currentPhase,
  explorationBatches,
  mixedBatches,
  refinementBatches,
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min((currentBatch / totalBatches) * 100, 100);

  // Calculate phase boundaries for visual segments
  const explorationEnd = (explorationBatches / totalBatches) * 100;
  const mixedEnd = ((explorationBatches + mixedBatches) / totalBatches) * 100;
  const refinementEnd = 100;

  // Get phase display info
  const getPhaseInfo = () => {
    switch (currentPhase) {
      case "exploration":
        return {
          name: "Exploration Phase",
          description: "Building initial rankings",
          color: "#FF9800",
        };
      case "mixed":
        return {
          name: "Mixed Phase",
          description: "Comparing similar players",
          color: "#2196F3",
        };
      case "refinement":
        return {
          name: "Refinement Phase",
          description: "Finalizing close rankings",
          color: "#4CAF50",
        };
      default:
        return {
          name: "Complete",
          description: "Rankings finalized",
          color: "#9C27B0",
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.batchInfo}>
          <strong>
            Batch {currentBatch + 1} of {totalBatches}
          </strong>
        </div>
        <span
          className={styles.phaseIndicator}
          style={{ color: phaseInfo.color }}
        >
          {phaseInfo.name}
        </span>
        <div className={styles.progressText}>
          {Math.round(progressPercentage)}% Complete
        </div>
      </div>

      <div className={styles.progressBarContainer}>
        {/* Background segments showing phases */}
        <div className={styles.phaseSegments}>
          <div
            className={`${styles.phaseSegment} ${styles.exploration}`}
            style={{ width: `${explorationEnd}%` }}
          />
          <div
            className={`${styles.phaseSegment} ${styles.mixed}`}
            style={{
              width: `${mixedEnd - explorationEnd}%`,
              left: `${explorationEnd}%`,
            }}
          />
          <div
            className={`${styles.phaseSegment} ${styles.refinement}`}
            style={{
              width: `${refinementEnd - mixedEnd}%`,
              left: `${mixedEnd}%`,
            }}
          />
        </div>

        {/* Active progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: phaseInfo.color,
            }}
          />
        </div>
      </div>

      <div className={styles.phaseDescription}>
        <div className={styles.phaseDescriptionContent}>
        <span className={styles.phaseIcon}>
          {currentPhase === "exploration" && "🎲"}
          {currentPhase === "mixed" && "⚖️"}
          {currentPhase === "refinement" && "🎯"}
          {currentPhase === "complete" && "✅"}
        </span>
        {phaseInfo.description}
        </div>
        <div className={styles.instructions}>
        Select any players you like from this batch (or none):
      </div>
      </div>


    </div>
  );
};

export default BatchProgress;
