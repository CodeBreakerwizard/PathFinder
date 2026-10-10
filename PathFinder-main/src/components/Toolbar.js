import React from 'react';

const ALGORITHMS = [
  { value: 'bfs', label: 'Breadth-First Search' },
  { value: 'dfs', label: 'Depth-First Search' },
  { value: 'dijkstra', label: "Dijkstra's Algorithm" },
  { value: 'astar', label: 'A* Search' },
];

const SPEEDS = [
  { value: 'fast', label: 'Fast' },
  { value: 'medium', label: 'Medium' },
  { value: 'slow', label: 'Slow' },
];

const Toolbar = ({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  onVisualize,
  onGenerateMaze,
  onClearBoard,
  onClearPath,
  isRunning,
  stats,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <span className="toolbar-brand-mark">›_</span>
        <span>PathFinder</span>
      </div>

      <div className="toolbar-group">
        <label htmlFor="algo-select">Algorithm</label>
        <select
          id="algo-select"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isRunning}
        >
          {ALGORITHMS.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>

      <div className="toolbar-group">
        <label htmlFor="speed-select">Speed</label>
        <select
          id="speed-select"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          disabled={isRunning}
        >
          {SPEEDS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="toolbar-actions">
        <button className="btn btn-primary" onClick={onVisualize} disabled={isRunning}>
          {isRunning ? 'Running…' : 'Visualize'}
        </button>
        <button className="btn" onClick={onGenerateMaze} disabled={isRunning}>
          Generate Maze
        </button>
        <button className="btn" onClick={onClearPath} disabled={isRunning}>
          Clear Path
        </button>
        <button className="btn btn-ghost" onClick={onClearBoard} disabled={isRunning}>
          Clear Board
        </button>
      </div>

      {stats && (
        <div className="toolbar-stats">
          <span><strong>{stats.visited}</strong> visited</span>
          <span><strong>{stats.pathLength}</strong> path length</span>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
