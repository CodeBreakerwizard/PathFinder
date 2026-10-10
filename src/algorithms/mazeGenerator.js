// Recursive Division maze generation algorithm.
// Recursively divides the grid with walls, leaving a single gap per wall
// so the maze is always solvable.

const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Returns an array of wall-node coordinates (in build order) for animation
export const generateMaze = (rows, cols, startPos, endPos) => {
  const walls = [];

  const isStartOrEnd = (r, c) =>
    (r === startPos.row && c === startPos.col) ||
    (r === endPos.row && c === endPos.col);

  const chooseOrientation = (width, height) => {
    if (width < height) return HORIZONTAL;
    if (height < width) return VERTICAL;
    return Math.random() < 0.5 ? HORIZONTAL : VERTICAL;
  };

  const divide = (rowStart, rowEnd, colStart, colEnd) => {
    const height = rowEnd - rowStart;
    const width = colEnd - colStart;

    if (height < 2 || width < 2) return; // too small to divide further

    const orientation = chooseOrientation(width, height);

    if (orientation === HORIZONTAL) {
      // Pick a row to draw the wall, with even offset for clean halves
      const wallRow = randomInt(rowStart, rowEnd - 1);
      const passageCol = randomInt(colStart, colEnd);

      for (let c = colStart; c <= colEnd; c++) {
        if (c === passageCol) continue;
        if (!isStartOrEnd(wallRow, c)) walls.push({ row: wallRow, col: c });
      }

      divide(rowStart, wallRow - 1, colStart, colEnd);
      divide(wallRow + 1, rowEnd, colStart, colEnd);
    } else {
      const wallCol = randomInt(colStart, colEnd - 1);
      const passageRow = randomInt(rowStart, rowEnd);

      for (let r = rowStart; r <= rowEnd; r++) {
        if (r === passageRow) continue;
        if (!isStartOrEnd(r, wallCol)) walls.push({ row: r, col: wallCol });
      }

      divide(rowStart, rowEnd, colStart, wallCol - 1);
      divide(rowStart, rowEnd, wallCol + 1, colEnd);
    }
  };

  divide(0, rows - 1, 0, cols - 1);
  return walls;
};
