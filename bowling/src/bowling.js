
export const pippo = 123;

export function game(pinsString) {

  const rolls = pinsString.split('.')
    .map(s => Number.parseInt(s));

  console.log(JSON.stringify(rolls));

  const score = rolls
    .reduce((acc, curr) => {
      /**
       * NOTHING REALLY CREATIVE HERE
       * acc may become the situation of the game
       * with all the usual stuff (did we just spare/strike? etc.)
       */
      return acc + curr;
    }, 0);

  return x => score;
} 
