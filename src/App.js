import React, { useState, useCallback, useRef, useEffect } from 'react';
import Node from './components/Node';
import Toolbar from './components/Toolbar';
import { createInitialGrid, cloneGrid } from './algorithms/gridUtils';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { dijkstra } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';
import { generateMaze } from './algorithms/mazeGenerator';
import './App.css';

const ROWS = 20;
const COLS = 46;
const START_POS = { row: 10, col: 8 };
const END_POS = { row: 10, col: 38 };

const SPEED_MS = { fast: 6, medium: 18, slow: 40 };

const ALGORITHMS = { bfs, dfs, dijkstra, astar };

function App() {
  const [grid, setGrid] = useState(() => createInitialGrid(ROWS, COLS, START_POS, END_POS));
  const [algorithm, setAlgorithm] = useState('astar');
  const [speed, setSpeed] = useState('fast');
  const [isRunning, setIsRunning] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [stats, setStats] = useState(null);
  const [draggingSpecial, setDraggingSpecial] = useState(null); // 'start' | 'end' | null

  const startPosRef = useRef(START_POS);
  const endPosRef = useRef(END_POS);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  // ─── Mouse Handlers for Wall Drawing ──────────────────────────────────────

  const handleMouseDown = useCallback((row, col) => {
    if (isRunning) return;
    const node = grid[row][col];

    if (node.isStart) {
      setDraggingSpecial('start');
      return;
    }
    if (node.isEnd) {
      setDraggingSpecial('end');
      return;
    }

    setIsMousePressed(true);
    toggleWall(row, col);
  }, [grid, isRunning]);

  const handleMouseEnter = useCallback((row, col) => {
    if (isRunning) return;

    if (draggingSpecial === 'start') {
      moveSpecialNode(row, col, 'start');
      return;
    }
    if (draggingSpecial === 'end') {
      moveSpecialNode(row, col, 'end');
      return;
    }

    if (isMousePressed) {
      toggleWall(row, col);
    }
  }, [isMousePressed, draggingSpecial, isRunning]);

  const handleMouseUp = useCallback(() => {
    setIsMousePressed(false);
    setDraggingSpecial(null);
  }, []);

  const toggleWall = (row, col) => {
    setGrid((prevGrid) => {
      const node = prevGrid[row][col];
      if (node.isStart || node.isEnd) return prevGrid;
      const newGrid = cloneGrid(prevGrid);
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
      return newGrid;
    });
  };

  const moveSpecialNode = (row, col, type) => {
    setGrid((prevGrid) => {
      const targetNode = prevGrid[row][col];
      if (targetNode.isWall) return prevGrid;
      if (type === 'start' && targetNode.isEnd) return prevGrid;
      if (type === 'end' && targetNode.isStart) return prevGrid;

      const newGrid = cloneGrid(prevGrid);
      const oldPos = type === 'start' ? startPosRef.current : endPosRef.current;

      newGrid[oldPos.row][oldPos.col][type === 'start' ? 'isStart' : 'isEnd'] = false;
      newGrid[row][col][type === 'start' ? 'isStart' : 'isEnd'] = true;

      if (type === 'start') startPosRef.current = { row, col };
      else endPosRef.current = { row, col };

      return newGrid;
    });
  };

  // ─── Visualize Algorithm ──────────────────────────────────────────────────

  const clearTimeoutsAndReset = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const handleVisualize = () => {
    if (isRunning) return;
    clearTimeoutsAndReset();

    // Work on a deep clone so the algorithm can mutate node.distance etc.
    const workingGrid = cloneGrid(grid);
    for (const row of workingGrid) {
      for (const node of row) {
        node.isVisited = false;
        node.distance = Infinity;
        node.gScore = Infinity;
        node.fScore = Infinity;
        node.previousNode = null;
      }
    }

    const startNode = workingGrid[startPosRef.current.row][startPosRef.current.col];
    const endNode = workingGrid[endPosRef.current.row][endPosRef.current.col];

    const algoFn = ALGORITHMS[algorithm];
    const { visitedNodesInOrder, path } = algoFn(workingGrid, startNode, endNode);

    setIsRunning(true);
    animateAlgorithm(visitedNodesInOrder, path);
  };

  const animateAlgorithm = (visitedNodesInOrder, path) => {
    const delay = SPEED_MS[speed];

    visitedNodesInOrder.forEach((node, i) => {
      const timeoutId = setTimeout(() => {
        if (node.isStart || node.isEnd) return;
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = 'node node-visited';
      }, i * delay);
      timeoutsRef.current.push(timeoutId);
    });

    const pathStartDelay = visitedNodesInOrder.length * delay;

    path.forEach((node, i) => {
      const timeoutId = setTimeout(() => {
        if (node.isStart || node.isEnd) return;
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = 'node node-path';
      }, pathStartDelay + i * Math.max(delay, 25));
      timeoutsRef.current.push(timeoutId);
    });

    const finishDelay = pathStartDelay + path.length * Math.max(delay, 25) + 50;
    const finishTimeout = setTimeout(() => {
      setIsRunning(false);
      setStats({
        visited: visitedNodesInOrder.length,
        pathLength: path.length > 0 ? path.length - 1 : 0,
      });
    }, finishDelay);
    timeoutsRef.current.push(finishTimeout);
  };

  // ─── Maze Generation ──────────────────────────────────────────────────────

  const handleGenerateMaze = () => {
    if (isRunning) return;
    clearTimeoutsAndReset();
    setStats(null);

    const freshGrid = createInitialGrid(ROWS, COLS, startPosRef.current, endPosRef.current);
    const wallCoords = generateMaze(ROWS, COLS, startPosRef.current, endPosRef.current);

    setIsRunning(true);
    wallCoords.forEach(({ row, col }, i) => {
      const timeoutId = setTimeout(() => {
        const el = document.getElementById(`node-${row}-${col}`);
        if (el) el.className = 'node node-wall';
      }, i * 4);
      timeoutsRef.current.push(timeoutId);
    });

    const finishTimeout = setTimeout(() => {
      const wallSet = new Set(wallCoords.map((w) => `${w.row}-${w.col}`));
      const newGrid = freshGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isWall: wallSet.has(`${node.row}-${node.col}`),
        }))
      );
      setGrid(newGrid);
      setIsRunning(false);
    }, wallCoords.length * 4 + 50);
    timeoutsRef.current.push(finishTimeout);
  };

  // ─── Clear Functions ──────────────────────────────────────────────────────

  const handleClearBoard = () => {
    if (isRunning) return;
    clearTimeoutsAndReset();
    setStats(null);
    setGrid(createInitialGrid(ROWS, COLS, startPosRef.current, endPosRef.current));
  };

  const handleClearPath = () => {
    if (isRunning) return;
    clearTimeoutsAndReset();
    setStats(null);
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isVisited: false,
          distance: Infinity,
          gScore: Infinity,
          fScore: Infinity,
          previousNode: null,
        }))
      )
    );
    // Reset DOM classes directly (avoids full re-render flash)
    document.querySelectorAll('.node-visited, .node-path').forEach((el) => {
      const [, r, c] = el.id.split('-');
      const node = grid[r][c];
      if (!node) return;
      el.className = node.isWall ? 'node node-wall' : 'node';
    });
  };

  return (
    <div className="app" onMouseLeave={() => setIsMousePressed(false)}>
      <Toolbar
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        speed={speed}
        setSpeed={setSpeed}
        onVisualize={handleVisualize}
        onGenerateMaze={handleGenerateMaze}
        onClearBoard={handleClearBoard}
        onClearPath={handleClearPath}
        isRunning={isRunning}
        stats={stats}
      />

      <div className="legend">
        <span><i className="legend-swatch legend-start" /> Start</span>
        <span><i className="legend-swatch legend-end" /> End</span>
        <span><i className="legend-swatch legend-wall" /> Wall</span>
        <span><i className="legend-swatch legend-visited" /> Visited</span>
        <span><i className="legend-swatch legend-path" /> Shortest Path</span>
        <span className="legend-hint">Drag Start/End nodes to move them · Click and drag to draw walls</span>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        onMouseUp={handleMouseUp}
      >
        {grid.map((row, rowIdx) =>
          row.map((node, colIdx) => (
            <Node
              key={`${rowIdx}-${colIdx}`}
              row={rowIdx}
              col={colIdx}
              isStart={node.isStart}
              isEnd={node.isEnd}
              isWall={node.isWall}
              isVisited={node.isVisited}
              isPath={false}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
