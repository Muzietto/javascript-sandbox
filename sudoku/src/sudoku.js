const SECTORSIZE = 3;
const DEBUGGING = true;
const STEPPING = false;

const ROWS3 = {
  1: [1,2,3,4,5,6,7,8,9],
  2: [10,11,12,13,14,15,16,17,18],
  3: [19,20,21,22,23,24,25,26,27],
  4: [28,29,30,31,32,33,34,35,36],
  5: [37,38,39,40,41,42,43,44,45],
  6: [46,47,48,49,50,51,52,53,54],
  7: [55,56,57,58,59,60,61,62,63],
  8: [64,65,66,67,68,69,70,71,72],
  9: [73,74,75,76,77,78,79,80,81],
}

const COLUMNS3 = {
  1: [1,10,19,28,37,46,55,64,73],
  2: [2,11,20,29,38,47,56,65,74],
  3: [3,12,21,30,39,48,57,66,75],
  4: [4,13,22,31,40,49,58,67,76],
  5: [5,14,23,32,41,50,59,68,77],
  6: [6,15,24,33,42,51,60,69,78],
  7: [7,16,25,34,43,52,61,70,79],
  8: [8,17,26,35,44,53,62,71,80],
  9: [9,18,27,36,45,54,63,72,81],
}

const SECTORS3 = {
  1: [1,2,3,10,11,12,19,20,21],
  2: [4,5,6,13,14,15,22,23,24],
  3: [7,8,9,16,17,18,25,26,27],
  4: [28,29,30,37,38,39,46,47,48],
  5: [31,32,33,40,41,42,49,50,51],
  6: [34,35,36,43,44,45,52,53,54],
  7: [55,56,57,64,65,66,73,74,75],
  8: [58,59,60,67,68,69,76,77,78],
  9: [61,62,63,70,71,72,79,80,81],
}

const ROWS2 = {
  1: [1,2,3,4],
  2: [5,6,7,8],
  3: [9,10,11,12],
  4: [13,14,15,16],
}

const COLUMNS2 = {
  1: [1,5,9,13],
  2: [2,6,10,14],
  3: [3,7,11,15],
  4: [4,8,12,16],
}

const SECTORS2 = {
  1: [1,2,5,6],
  2: [3,4,7,8],
  3: [9,10,13,14],
  4: [11,12,15,16],
}

export function cellInSectorIndex(cellIndex, sectorSize = SECTORSIZE) {
  if (sectorSize === 2) {
    if (SECTORS2[1].includes(cellIndex)) return SECTORS2[1].indexOf(cellIndex) + 1;
    if (SECTORS2[2].includes(cellIndex)) return SECTORS2[2].indexOf(cellIndex) + 1;
    if (SECTORS2[3].includes(cellIndex)) return SECTORS2[3].indexOf(cellIndex) + 1;
    if (SECTORS2[4].includes(cellIndex)) return SECTORS2[4].indexOf(cellIndex) + 1;
  }
  if (sectorSize === 3) {
    if (SECTORS3[1].includes(cellIndex)) return SECTORS3[1].indexOf(cellIndex) + 1;
    if (SECTORS3[2].includes(cellIndex)) return SECTORS3[2].indexOf(cellIndex) + 1;
    if (SECTORS3[3].includes(cellIndex)) return SECTORS3[3].indexOf(cellIndex) + 1;
    if (SECTORS3[4].includes(cellIndex)) return SECTORS3[4].indexOf(cellIndex) + 1;
    if (SECTORS3[5].includes(cellIndex)) return SECTORS3[5].indexOf(cellIndex) + 1;
    if (SECTORS3[6].includes(cellIndex)) return SECTORS3[6].indexOf(cellIndex) + 1;
    if (SECTORS3[7].includes(cellIndex)) return SECTORS3[7].indexOf(cellIndex) + 1;
    if (SECTORS3[8].includes(cellIndex)) return SECTORS3[8].indexOf(cellIndex) + 1;
    if (SECTORS3[9].includes(cellIndex)) return SECTORS3[9].indexOf(cellIndex) + 1;
  }
}

export function rowIndex(cellIndex, sectorSize = SECTORSIZE) {
  if (sectorSize === 2) {
    if (ROWS2[1].includes(cellIndex)) return 1;
    if (ROWS2[2].includes(cellIndex)) return 2;
    if (ROWS2[3].includes(cellIndex)) return 3;
    if (ROWS2[4].includes(cellIndex)) return 4;
  }
  if (sectorSize === 3) {
    if (ROWS3[1].includes(cellIndex)) return 1;
    if (ROWS3[2].includes(cellIndex)) return 2;
    if (ROWS3[3].includes(cellIndex)) return 3;
    if (ROWS3[4].includes(cellIndex)) return 4;
    if (ROWS3[5].includes(cellIndex)) return 5;
    if (ROWS3[6].includes(cellIndex)) return 6;
    if (ROWS3[7].includes(cellIndex)) return 7;
    if (ROWS3[8].includes(cellIndex)) return 8;
    if (ROWS3[9].includes(cellIndex)) return 9;
  }
}

export function columnIndex(cellIndex, sectorSize = SECTORSIZE) {
  if (sectorSize === 2) {
    if (COLUMNS2[1].includes(cellIndex)) return 1;
    if (COLUMNS2[2].includes(cellIndex)) return 2;
    if (COLUMNS2[3].includes(cellIndex)) return 3;
    if (COLUMNS2[4].includes(cellIndex)) return 4;
  }
  if (sectorSize === 3) {
    if (COLUMNS3[1].includes(cellIndex)) return 1;
    if (COLUMNS3[2].includes(cellIndex)) return 2;
    if (COLUMNS3[3].includes(cellIndex)) return 3;
    if (COLUMNS3[4].includes(cellIndex)) return 4;
    if (COLUMNS3[5].includes(cellIndex)) return 5;
    if (COLUMNS3[6].includes(cellIndex)) return 6;
    if (COLUMNS3[7].includes(cellIndex)) return 7;
    if (COLUMNS3[8].includes(cellIndex)) return 8;
    if (COLUMNS3[9].includes(cellIndex)) return 9;
  }
}

export function sectorIndex(cellIndex, sectorSize = SECTORSIZE) {
  if (sectorSize === 2) {
    if (SECTORS2[1].includes(cellIndex)) return 1;
    if (SECTORS2[2].includes(cellIndex)) return 2;
    if (SECTORS2[3].includes(cellIndex)) return 3;
    if (SECTORS2[4].includes(cellIndex)) return 4;
  }
  if (sectorSize === 3) {
    if (SECTORS3[1].includes(cellIndex)) return 1;
    if (SECTORS3[2].includes(cellIndex)) return 2;
    if (SECTORS3[3].includes(cellIndex)) return 3;
    if (SECTORS3[4].includes(cellIndex)) return 4;
    if (SECTORS3[5].includes(cellIndex)) return 5;
    if (SECTORS3[6].includes(cellIndex)) return 6;
    if (SECTORS3[7].includes(cellIndex)) return 7;
    if (SECTORS3[8].includes(cellIndex)) return 8;
    if (SECTORS3[9].includes(cellIndex)) return 9;
  }
}

function ROWS(sectorSize = SECTORSIZE) {
  if (sectorSize === 2) return ROWS2;
  if (sectorSize === 3) return ROWS3;
}

function COLUMNS(sectorSize = SECTORSIZE) {
  if (sectorSize === 2) return COLUMNS2;
  if (sectorSize === 3) return COLUMNS3;
}

function SECTORS(sectorSize = SECTORSIZE) {
  if (sectorSize === 2) return SECTORS2;
  if (sectorSize === 3) return SECTORS3;
}

export function rowElements(sudoku, rowIndex, sectorSize = SECTORSIZE) {
  return ROWS(sectorSize)[rowIndex].map(cellIndex => sudoku[cellIndex]);
}

export function columnElements(sudoku, columnIndex, sectorSize = SECTORSIZE) {
  return COLUMNS(sectorSize)[columnIndex].map(cellIndex => sudoku[cellIndex]);
}

export function sectorElements(sudoku, sectorIndex, sectorSize = SECTORSIZE) {
  return SECTORS(sectorSize)[sectorIndex].map(cellIndex => sudoku[cellIndex]);
}

export function okInRow(candidate, columnIndex, rowElements) {
  return !rowElements.includes(candidate)
    && !rowElements[columnIndex -1];
}

export function okInColumn(candidate, rowIndex, columnElements) {
  return !columnElements.includes(candidate)
    && !columnElements[rowIndex -1];
}

export function okInSector(candidate, cellInSectorIndex, sectorElements) {
  return !sectorElements.includes(candidate)
    && !sectorElements[cellInSectorIndex - 1];
}

export function removed(sudoku, cellIndex) {
  const result = sudoku.slice();
  result[cellIndex] = 0;
  return result;
}

export function added(sudoku, cellIndex, candidate) {
  const result = sudoku.slice();
  result[cellIndex] = candidate;
  return result;
}

export function validCandidate(sudoku, cellIndex, candidate, sectorSize = SECTORSIZE) {
  return okInRow(candidate, columnIndex(cellIndex, sectorSize), rowElements(sudoku, rowIndex(cellIndex, sectorSize), sectorSize))
    && okInColumn(candidate, rowIndex(cellIndex, sectorSize), columnElements(sudoku, columnIndex(cellIndex, sectorSize), sectorSize))
    && okInSector(candidate, cellInSectorIndex(cellIndex, sectorSize), sectorElements(sudoku, sectorIndex(cellIndex, sectorSize), sectorSize));
}

export function dumper(cellsWithEmptyPositionZero, sectorSize = SECTORSIZE) {
  const result = cellsWithEmptyPositionZero
    .slice(1)
    .reduce((acc, curr, index) => {
      if ((index+1) % Math.pow(sectorSize, 4) === 0) return acc + cell2(curr) + '|';
      if ((index+1) % Math.pow(sectorSize, 3) === 0 || (index+1) % 54 === 0) {
        return acc + cell2(curr) + divider(sectorSize);
      }
      if ((index+1) % Math.pow(sectorSize, 2) === 0) return acc + cell2(curr) + '|\n|';
      if ((index+1) % sectorSize === 0) return acc + cell2(curr) + '|';
      return acc + cell(curr);
    }, '|');
  if (DEBUGGING) console.log('DUMPER DUMPER DUMPER');
  if (DEBUGGING) console.log(result);
  if (DEBUGGING) console.log('DUMPER DUMPER DUMPER');
  return result;

  function cell(x, cho) {
    return (!!!x)
      ? '_ '
      : x + ' ';
  }
  function cell2(x, chop) {
    return (!!!x)
      ? '_'
      : x;
  }
  function divider(sectorSize) {
    return (sectorSize === 3)
        ? '|\n ----- ----- ----- \n|'
        : '|\n --- --- \n|';
  }
}

export function sudoku({
  startCells, // includes an empty slot 0
  cells, // includes an empty slot 0
  position,
  candidate,
  backtracking = false,
  STARTMILLIS,
  ENDMILLIS,
}) {
  const sectorSize = (cells.length === 82) ? 3 : 2;
  if (position === Math.pow(sectorSize, 4) + 1) { // sudoku completed
    if (DEBUGGING) console.log('sudoku - game completed');
    ENDMILLIS = new Date().getTime();
    console.log('STARTMILLIS', STARTMILLIS);
    console.log('ENDMILLIS', ENDMILLIS);
    console.log(`travel time ${(ENDMILLIS - STARTMILLIS)/1000} secondi`);
    return dumper(cells, sectorSize);
  }
  if (startCells[position] > 0) { // cell valorized by game creator
    if (!backtracking) {
      if (DEBUGGING) console.log(`sudoku - found a position ${position} filled by the game creator`);
      return {
        startCells,
        cells,
        position: position + 1,
        candidate: 1,
        STARTMILLIS,
        ENDMILLIS,
      };
    }
    if (DEBUGGING) console.log(`sudoku - backtracking on a position ${position} filled by the game creator`);
    return { // backtracking
      startCells,
      cells: startCells[position - 1]
        ? cells
        : removed(cells, position - 1),
      position: position - 1,
      candidate: startCells[position - 1]
        ? startCells[position - 1]
        : cells[position - 1] + 1,
      backtracking: true,
      STARTMILLIS,
      ENDMILLIS,
    };
  }
  if (candidate === Math.pow(sectorSize, 2) + 1) { // no candidate found -> backtrack
    if (DEBUGGING) console.log(`sudoku - position ${position}, candidate ${candidate}: gotta backtrack`);
    return {
      startCells,
      cells: startCells[position - 1]
        ? cells
        : removed(cells, position - 1),
      position: position - 1,
      candidate: startCells[position - 1]
        ? startCells[position - 1]
        : cells[position - 1] + 1,
      backtracking: true,
      STARTMILLIS,
      ENDMILLIS,
    };
  }
  if (validCandidate(cells, position, candidate, sectorSize)) {
    if (DEBUGGING) console.log(`sudoku - position ${position}, candidate ${candidate} OK: one step beyond!`);
    return {
      startCells,
      cells: added(cells, position, candidate),
      position: position + 1,
      candidate: 1,
      STARTMILLIS,
      ENDMILLIS,
    };
  }
  if (DEBUGGING) console.log(`sudoku - position ${position}, candidate ${candidate} KO: increasing it`);
  return {
    startCells,
    cells: cells,
    position,
    candidate: candidate + 1,
    STARTMILLIS,
    ENDMILLIS,
  };
}

export function executor(current, sectorSize = SECTORSIZE) {
  if (current.cells) {
    if (STEPPING) {
      console.log('Press any key to continue.');
      process.stdin.once('data', function () {
        if (DEBUGGING) console.log('position', current.position);
        if (DEBUGGING) console.log('candidate', current.candidate);
        if (DEBUGGING) console.log('start', JSON.stringify(current.startCells));
        if (DEBUGGING) console.log('cells', JSON.stringify(current.cells));
        dumper(current.startCells, sectorSize);
        dumper(current.cells, sectorSize);
        const next = sudoku(current);
        setTimeout(() => {
          executor(next, sectorSize);
        }, 0);
      });
    } else {
      const next = sudoku(current);
      setTimeout(() => {
        executor(next, sectorSize);
      }, 0);
    }
  }
  return;
}
