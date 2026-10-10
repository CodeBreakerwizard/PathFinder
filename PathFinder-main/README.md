# PathFinder — Graph Algorithm Visualizer

An interactive React app that visualizes BFS, DFS, Dijkstra's, and A* pathfinding algorithms on a grid, with animated Recursive Division maze generation.

---

## Project Structure

```
pathfinder/
├── public/
│   └── index.html
├── src/
│   ├── algorithms/
│   │   ├── gridUtils.js       # Node model, grid creation, neighbor lookup
│   │   ├── bfs.js             # Breadth-First Search
│   │   ├── dfs.js             # Depth-First Search
│   │   ├── dijkstra.js        # Dijkstra's algorithm (binary min-heap)
│   │   ├── astar.js           # A* search (Manhattan heuristic)
│   │   └── mazeGenerator.js   # Recursive Division maze generation
│   ├── components/
│   │   ├── Node.js            # Single grid cell
│   │   └── Toolbar.js         # Algorithm/speed selectors + action buttons
│   ├── App.js                 # Main app: grid state, mouse handling, animation
│   ├── App.css                # All styling (dark terminal aesthetic)
│   └── index.js                # React entry point
└── package.json
```

---

## Requirements

- **Node.js 16+** and **npm** (comes bundled with Node)
- A modern browser (Chrome, Firefox, Edge, Safari)

Check your versions:
```bash
node --version
npm --version
```
If you don't have Node installed, download it from https://nodejs.org (LTS version recommended).

---

## How to Run — Step by Step

### Step 1: Get the project onto your machine
Unzip the provided `PathFinder.zip` anywhere on your computer, e.g.:
```bash
unzip PathFinder.zip
cd pathfinder
```

### Step 2: Install dependencies
This downloads React and the build tooling (react-scripts) into a `node_modules` folder.
```bash
npm install
```
This may take 1–2 minutes the first time.

### Step 3: Start the development server
```bash
npm start
```
This will:
- Compile the app
- Automatically open `http://localhost:3000` in your browser
- Hot-reload on every file save

### Step 4 (Optional): Build for production
If you want a static, optimized build (e.g. to deploy on Vercel/Netlify/GitHub Pages):
```bash
npm run build
```
This creates a `build/` folder with static HTML/CSS/JS you can host anywhere.

---

## How to Use the App

1. **Choose an algorithm** from the dropdown (BFS, DFS, Dijkstra, A*)
2. **Choose a speed** (Fast / Medium / Slow)
3. **Draw walls**: click and drag on empty cells
4. **Move Start/End nodes**: click and drag the violet (start) or rose (end) node anywhere on the grid
5. Click **Visualize** to watch the algorithm explore the grid and draw the shortest path
6. Click **Generate Maze** for an auto-generated solvable maze (Recursive Division algorithm)
7. Click **Clear Path** to remove visited/path highlighting but keep walls
8. Click **Clear Board** to reset everything

---

## Algorithms Implemented

| Algorithm | Guarantees Shortest Path? | How it Explores |
|-----------|---------------------------|------------------|
| BFS | Yes (unweighted grid) | Expands layer by layer (queue) |
| DFS | No | Goes deep into one branch first (stack) |
| Dijkstra | Yes | Always expands the closest unvisited node (min-heap) |
| A* | Yes (admissible heuristic) | Like Dijkstra but biased toward the goal using Manhattan distance |

---

## Troubleshooting

**`npm install` fails / hangs**
- Check your internet connection — it needs to download packages from the npm registry
- Try `npm cache clean --force` then `npm install` again

**Port 3000 already in use**
- Either stop whatever is using port 3000, or run:
  ```bash
  PORT=3001 npm start
  ```

**Blank page in browser**
- Open browser dev tools (F12) → Console tab → check for red errors and share them for debugging

**`react-scripts: command not found`**
- This means `npm install` didn't complete. Delete `node_modules` and `package-lock.json`, then run `npm install` again.
