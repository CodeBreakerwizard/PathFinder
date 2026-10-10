import { getNeighbors, reconstructPath } from './gridUtils';

// Depth-First Search — does NOT guarantee shortest path, explores deeply first
export const dfs = (grid, startNode, endNode) => {
  const visitedNodesInOrder = [];
  const visited = new Set();
  const stack = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop();
    const key = `${currentNode.row}-${currentNode.col}`;

    if (visited.has(key)) continue;
    visited.add(key);
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      return { visitedNodesInOrder, path: reconstructPath(endNode) };
    }

    const neighbors = getNeighbors(grid, currentNode);
    // Push in reverse so exploration order looks natural (up/down/left/right)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const nKey = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(nKey)) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};
