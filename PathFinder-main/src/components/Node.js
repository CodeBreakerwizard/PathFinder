import React from 'react';

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const getClassName = () => {
    if (isStart) return 'node node-start';
    if (isEnd) return 'node node-end';
    if (isPath) return 'node node-path';
    if (isVisited) return 'node node-visited';
    if (isWall) return 'node node-wall';
    return 'node';
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={getClassName()}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    />
  );
};

export default React.memo(Node);
