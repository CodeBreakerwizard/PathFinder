import { getNeighbors, reconstructPath } from './gridUtils';

// Breadth-First Search — guarantees shortest path on unweighted grid
// Returns { visitedNodesInOrder, path }
export const bfs = (grid, startNode, endNode) => {
  const visitedNodesInOrder = [];
  const visited = new Set();
  const queue = [startNode];

  startNode.distance = 0;
  visited.add(`${startNode.row}-${startNode.col}`);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      return { visitedNodesInOrder, path: reconstructPath(endNode) };
    }

    const neighbors = getNeighbors(grid, currentNode);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  // No path found
  return { visitedNodesInOrder, path: [] };
};
