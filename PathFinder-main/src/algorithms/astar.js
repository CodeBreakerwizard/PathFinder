import { getNeighbors, reconstructPath } from './gridUtils';

class MinHeap {
  constructor() { this.heap = []; }
  get size() { return this.heap.length; }

  push(node) {
    this.heap.push(node);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return top;
  }

  _bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent].fScore <= this.heap[idx].fScore) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }

  _bubbleDown(idx) {
    const n = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      if (left < n && this.heap[left].fScore < this.heap[smallest].fScore) smallest = left;
      if (right < n && this.heap[right].fScore < this.heap[smallest].fScore) smallest = right;
      if (smallest === idx) break;
      [this.heap[smallest], this.heap[idx]] = [this.heap[idx], this.heap[smallest]];
      idx = smallest;
    }
  }
}

// Manhattan distance heuristic (admissible for 4-directional grid movement)
const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

// A* search — uses f(n) = g(n) + h(n) to guide search toward the goal
export const astar = (grid, startNode, endNode) => {
  const visitedNodesInOrder = [];
  const visited = new Set();
  const pq = new MinHeap();

  startNode.gScore = 0;
  startNode.fScore = heuristic(startNode, endNode);
  pq.push(startNode);

  while (pq.size > 0) {
    const currentNode = pq.pop();
    const key = `${currentNode.row}-${currentNode.col}`;

    if (visited.has(key)) continue;
    visited.add(key);
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      return { visitedNodesInOrder, path: reconstructPath(endNode) };
    }

    const neighbors = getNeighbors(grid, currentNode);
    for (const neighbor of neighbors) {
      const nKey = `${neighbor.row}-${neighbor.col}`;
      if (visited.has(nKey)) continue;

      const tentativeG = currentNode.gScore + 1;
      if (tentativeG < neighbor.gScore) {
        neighbor.gScore = tentativeG;
        neighbor.fScore = tentativeG + heuristic(neighbor, endNode);
        neighbor.previousNode = currentNode;
        pq.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};
