export function greedSolver() {

  function _solve(diceStr) {
    let maxScoreSoFar = 0;
    const diceArra = diceStr
      .split('')
      .sort();
    console.log('diceArra', diceArra);

    let currentScore = 0;
    let remainingArra = diceArra;

    while (remainingArra.length > 0) {

      let remainingStr = remainingArra.join('');
      console.log('remainingStr', remainingStr)
      const currentRemainingStr = remainingStr;

      // https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
      // remainingArra = remainingArra.sort(() => Math.random() - 0.5);

      if (remainingStr.includes('111')) {
        currentScore += 1000;
        remainingStr = remainingStr.replace('111', '');
      }
      if (remainingStr.includes('1')) {
        currentScore += 100;
        remainingStr = remainingStr.replace('1', '');
      }
      if (remainingStr.includes('5')) {
        currentScore += 50;
        remainingStr = remainingStr.replace('5', '');
      }

      if (currentScore > maxScoreSoFar) {
        maxScoreSoFar = currentScore;
        console.log('maxScoreSoFar %s \n', maxScoreSoFar);
      }

      if (currentRemainingStr === remainingStr) {
        break;
      }
    }
    return maxScoreSoFar;
  }

  return {
    test: () => 'valueXXX',
    solve: _solve,
  };
}