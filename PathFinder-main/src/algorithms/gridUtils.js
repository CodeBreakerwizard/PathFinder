// Creates the initial grid of node objects
export const createNode = (row, col) => ({
  row,
  col,
  isStart: false,
  isEnd: false,
  isWall: false,
  isVisited: false,
  distance: Infinity,
  fScore: Infinity,        // used by A*
  gScore: Infinity,        // used by A*
  previousNode: null,
});

export const createInitialGrid = (rows, cols, startPos, endPos) => {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      const node = createNode(row, col);
      if (row === startPos.row && col === startPos.col) node.isStart = true;
      if (row === endPos.row && col === endPos.col) node.isEnd = true;
      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
};

// Deep clone helper — needed so React detects state changes
export const cloneGrid = (grid) => grid.map((row) => row.map((node) => ({ ...node })));

export const getNeighbors = (grid, node) => {
  const neighbors = [];
  const { row, col } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  if (row > 0) neighbors.push(grid[row - 1][col]);           // up
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]); // down
  if (col > 0) neighbors.push(grid[row][col - 1]);           // left
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]); // right

  return neighbors.filter((n) => !n.isWall);
};

// Diagonal neighbors included — used by A* for 8-directional movement
export const getNeighborsWithDiagonals = (grid, node) => {
  const neighbors = [];
  const { row, col } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  const deltas = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];

  for (const [dr, dc] of deltas) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
      neighbors.push(grid[r][c]);
    }
  }
  return neighbors.filter((n) => !n.isWall);
};

export const reconstructPath = (endNode) => {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
};
