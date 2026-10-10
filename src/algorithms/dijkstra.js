import { getNeighbors, reconstructPath } from './gridUtils';

// Simple binary min-heap priority queue keyed by distance
class MinHeap {
  constructor() {
    this.heap = [];
  }
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
      if (this.heap[parent].distance <= this.heap[idx].distance) break;
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
      if (left < n && this.heap[left].distance < this.heap[smallest].distance) smallest = left;
      if (right < n && this.heap[right].distance < this.heap[smallest].distance) smallest = right;
      if (smallest === idx) break;
      [this.heap[smallest], this.heap[idx]] = [this.heap[idx], this.heap[smallest]];
      idx = smallest;
    }
  }
}

// Dijkstra's algorithm — guarantees shortest path, supports weighted edges
// (here all edges have weight 1, but the algorithm generalizes)
export const dijkstra = (grid, startNode, endNode) => {
  const visitedNodesInOrder = [];
  const visited = new Set();
  const pq = new MinHeap();

  startNode.distance = 0;
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

      const tentativeDistance = currentNode.distance + 1; // edge weight = 1
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = currentNode;
        pq.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};
