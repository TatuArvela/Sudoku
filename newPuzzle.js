function generateNewPuzzle() {
  function generateEmptyPuzzle() {
    return '.'.repeat(81);
  }

  function randomCellIndex() {
    return Math.floor(Math.random() * 80)
  }

  function randomNumber() {
    return Math.floor(Math.random() * (9 - 1) + 1)
  }

  function randomCellIndexes() {
    let cells = [];
    for (let i = 0; i < 17; i++) {
      let index = null;
      while (index === null || cells.includes(index)) {
        index = randomCellIndex();
      }
      cells.push(index);
    }
    return cells;
  }

  function generateRandomPuzzleSeed() {
    let puzzle = generateEmptyPuzzle();
    const cellIndexes = randomCellIndexes();
    cellIndexes.forEach((cell) => {
      puzzle = puzzle.replaceAt(cell, randomNumber());
    });
    return puzzle;
  }

  function generateValidSolvedPuzzle() {
    let randomPuzzle;
    let solution = null;
    while (!solution) {
      randomPuzzle = generateRandomPuzzleSeed();
      const solutions = solver(randomPuzzle, 1);
      if (solutions.length > 0) {
        solution = solutions[0];
      }
    }
    return solution.join('');
  }

  const solvedPuzzle = generateValidSolvedPuzzle();
  const cellIndexes = randomCellIndexes();
  let puzzle = generateEmptyPuzzle();

  cellIndexes.forEach((cell) => {
    puzzle = puzzle.replaceAt(cell, solvedPuzzle.charAt(cell));
  });

  return puzzle;
}
