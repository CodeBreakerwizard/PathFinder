// Node types
export const NODE_TYPE = {
  EMPTY:   'empty',
  WALL:    'wall',
  START:   'start',
  END:     'end',
  VISITED: 'visited',
  PATH:    'path',
  WEIGHT:  'weight',   // weighted node (cost=5)
};

// Grid config
export const ROWS        = 21;
export const COLS        = 51;
export const WEIGHT_COST = 5;

// Animation speeds (ms per step)
export const SPEED = {
  fast:   8,
  medium: 30,
  slow:   80,
};

// Default start/end positions
export const START_NODE = { row: 10, col: 5  };
export const END_NODE   = { row: 10, col: 45 };

/**
 * Creates a single fresh node object.
 */
export const createNode = (row, col) => ({
  row,
  col,
  type:       NODE_TYPE.EMPTY,
  distance:   Infinity,
  fScore:     Infinity,
  gScore:     Infinity,
  hScore:     Infinity,
  isVisited:  false,
  previousNode: null,
  weight:     1,
});

/**
 * Creates the full initial grid.
 */
export const createInitialGrid = () => {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const node = createNode(r, c);
      if (r === START_NODE.row && c === START_NODE.col) node.type = NODE_TYPE.START;
      if (r === END_NODE.row   && c === END_NODE.col)   node.type = NODE_TYPE.END;
      row.push(node);
    }
    grid.push(row);
  }
  return grid;
};

/**
 * Deep-clones a grid resetting algorithm state but keeping walls/weights.
 */
export const resetAlgoState = (grid) =>
  grid.map(row =>
    row.map(node => ({
      ...node,
      distance:     Infinity,
      fScore:       Infinity,
      gScore:       Infinity,
      hScore:       Infinity,
      isVisited:    false,
      previousNode: null,
      type:
        node.type === NODE_TYPE.VISITED || node.type === NODE_TYPE.PATH
          ? NODE_TYPE.EMPTY
          : node.type,
    }))
  );

/**
 * Reconstructs shortest path by following previousNode pointers.
 */
export const getNodesInShortestPath = (endNode) => {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
};

export const heuristic = (a, b) =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

export const getNeighbors = (node, grid) => {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0)           neighbors.push(grid[row - 1][col]);
  if (row < ROWS - 1)   neighbors.push(grid[row + 1][col]);
  if (col > 0)           neighbors.push(grid[row][col - 1]);
  if (col < COLS - 1)   neighbors.push(grid[row][col + 1]);
  return neighbors.filter(n => n.type !== NODE_TYPE.WALL);
};
