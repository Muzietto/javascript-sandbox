import { expect } from 'chai';
import {
  rowIndex,
  columnIndex,
  sectorIndex,
  rowElements,
  columnElements,
  sectorElements,
  cellInSectorIndex,
  okInRow,
  okInColumn,
  okInSector,
  removed,
  added,
  validCandidate,
  dumper,
  sudoku,
  executor,
} from '../src/sudoku.js';

const WHOLE_SUDOKU = [0,5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const START_SUDOKU = [0,5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9];
const WHOLE_SUDOKU_REF = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];
const START_SUDOKU_REF = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];
const HARDEST_SUDOKU = [0,8,0,0,0,0,0,0,0,0,0,0,3,6,0,0,0,0,0,0,7,0,0,9,0,2,0,0,0,5,0,0,0,7,0,0,0,0,0,0,0,4,5,7,0,0,0,0,0,1,0,0,0,3,0,0,0,1,0,0,0,0,6,8,0,0,8,5,0,0,0,1,0,0,9,0,0,0,0,4,0,0];
const LOST_SUDOKU =    [0,0,5,0,0,3,1,0,0,8,1,9,0,0,0,2,0,7,0,0,0,8,0,0,0,0,0,0,0,0,0,5,6,0,0,2,4,9,0,0,2,0,8,0,0,7,4,6,0,0,7,3,0,0,0,0,0,0,0,0,0,7,0,0,0,7,0,8,0,0,0,6,5,8,0,0,9,5,0,0,4,0];

const WHOLE_SUDOKU2 = [0,2,4,1,3,3,1,4,2,4,2,3,1,1,3,2,4];
const START_SUDOKU2 = [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4];
const WHOLE_SUDOKU_REF2 = [
  [2,4,1,3],
  [3,1,4,2],
  [4,2,3,1],
  [1,3,2,4]
];
const START_SUDOKU_REF2 = [
  [2,0,0,0],
  [0,1,0,2],
  [0,0,3,0],
  [0,0,0,4]
];

// SECTORS
const TOP_LEFT3 = 1;
const TOP_CENTER3 = 2;
const TOP_RIGHT3 = 3;
const MIDDLE_LEFT3 = 4;
const MIDDLE_CENTER3 = 5;
const MIDDLE_RIGHT3 = 6;
const BOTTOM_LEFT3 = 7;
const BOTTOM_CENTER3 = 8;
const BOTTOM_RIGHT3 = 9;
const TOP_LEFT2 = 1;
const TOP_RIGHT2 = 2;
const BOTTOM_LEFT2 = 3;
const BOTTOM_RIGHT2 = 4;


// CANDIDATES
const ONE = 1;
const TWO = 2;
const THREE = 3;
const FOUR = 4;
const FIVE = 5;
const SIX = 6;
const SEVEN = 7;
const EIGHT = 8;
const NINE = 9;

describe('to solve a sudoku', () => {
  describe('you need to identify', () => {
    it('rowIndexes', () => {
      expect(rowIndex(2)).to.eql(1);
      expect(rowIndex(15)).to.eql(2);
      expect(rowIndex(25)).to.eql(3);
      expect(rowIndex(81)).to.eql(9);
    });
    it('rowIndexes SECTORSIZE 2', () => {
      expect(rowIndex(2, 2)).to.eql(1);
      expect(rowIndex(5, 2)).to.eql(2);
      expect(rowIndex(11, 2)).to.eql(3);
      expect(rowIndex(16, 2)).to.eql(4);
    });
    it('columnIndexes', () => {
      expect(columnIndex(1)).to.eql(1);
      expect(columnIndex(56)).to.eql(2);
      expect(columnIndex(66)).to.eql(3);
      expect(columnIndex(9)).to.eql(9);
    });
    it('columnIndexes SECTORSIZE 2', () => {
      expect(columnIndex(1, 2)).to.eql(1);
      expect(columnIndex(14, 2)).to.eql(2);
      expect(columnIndex(7, 2)).to.eql(3);
      expect(columnIndex(12, 2)).to.eql(4);
    });
    it('sectorIndexes', () => {
      expect(sectorIndex(1)).to.eql(1);
      expect(sectorIndex(47)).to.eql(4);
      expect(sectorIndex(55)).to.eql(7);
      expect(sectorIndex(81)).to.eql(9);
    });
    it('sectorIndexes SECTORSIZE 2', () => {
      expect(sectorIndex(1, 2)).to.eql(1);
      expect(sectorIndex(8, 2)).to.eql(2);
      expect(sectorIndex(10, 2)).to.eql(3);
      expect(sectorIndex(11, 2)).to.eql(4);
    });
    it('cellInSectorIndexes', () => {
      expect(cellInSectorIndex(1)).to.eql(1);
      expect(cellInSectorIndex(6)).to.eql(3);
      expect(cellInSectorIndex(45)).to.eql(6);
      expect(cellInSectorIndex(74)).to.eql(8);
    });
    it('cellInSectorIndexes SECTORSIZE 2', () => {
      expect(cellInSectorIndex(1, 2)).to.eql(1);
      expect(cellInSectorIndex(4, 2)).to.eql(2);
      expect(cellInSectorIndex(13, 2)).to.eql(3);
      expect(cellInSectorIndex(8, 2)).to.eql(4);
    });
  });
  describe('you need to extract', () => {
    it('rowElements', () => {
      expect(rowElements(START_SUDOKU, 1))
        .to.eql([5,3,0,0,7,0,0,0,0]);
      expect(rowElements(START_SUDOKU, 4))
        .to.eql([8,0,0,0,6,0,0,0,3]);
      expect(rowElements(START_SUDOKU, 9))
        .to.eql([0,0,0,0,8,0,0,7,9]);
    });
    it('rowElements SECTORSIZE 2', () => {
      expect(rowElements(START_SUDOKU2, 1, 2))
        .to.eql([2,0,0,0]);
      expect(rowElements(START_SUDOKU2, 3, 2))
        .to.eql([0,0,3,0]);
      expect(rowElements(START_SUDOKU2, 4, 2))
        .to.eql([0,0,0,4]);
    });
    it('columnElements', () => {
      expect(columnElements(START_SUDOKU, 1))
        .to.eql([5,6,0,8,4,7,0,0,0]);
      expect(columnElements(START_SUDOKU, 7))
        .to.eql([0,0,0,0,0,0,2,0,0]);
      expect(columnElements(START_SUDOKU, 9))
        .to.eql([0,0,0,3,1,6,0,5,9]);
    });
    it('columnElements SECTORSIZE 2', () => {
      expect(columnElements(WHOLE_SUDOKU2, 1, 2))
        .to.eql([2,3,4,1]);
      expect(columnElements(WHOLE_SUDOKU2, 3, 2))
        .to.eql([1,4,3,2]);
      expect(columnElements(WHOLE_SUDOKU2, 4, 2))
        .to.eql([3,2,1,4]);
    });
    it('sectorElements', () => {
      expect(sectorElements(START_SUDOKU, 1))
        .to.eql([5,3,0,6,0,0,0,9,8]);
      expect(sectorElements(START_SUDOKU, 4))
        .to.eql([8,0,0,4,0,0,7,0,0]);
      expect(sectorElements(START_SUDOKU, 9))
        .to.eql([2,8,0,0,0,5,0,7,9]);
    });
    it('sectorElements SECTORSIZE 2', () => {
      expect(sectorElements(START_SUDOKU2, 1, 2))
        .to.eql([2,0,0,1]);
      expect(sectorElements(START_SUDOKU2, 2, 2))
        .to.eql([0,0,0,2]);
      expect(sectorElements(START_SUDOKU2, 3, 2))
        .to.eql([0,0,0,0]);
    });
  });
  describe('you gotta be able to check whether', () => {
    it('a candidate fits in a row', () => {
      expect(okInRow(ONE, 9, rowElements(START_SUDOKU, 1))).to.be.true;
      expect(okInRow(ONE, 1, rowElements(START_SUDOKU, 1))).to.be.false;
      expect(okInRow(ONE, 1, rowElements(START_SUDOKU, 8))).to.be.false;
      expect(okInRow(TWO, 1, rowElements(START_SUDOKU, 8))).to.be.true;
    });
    it('a candidate fits in a row SECTORSIZE 2', () => {
      expect(okInRow(ONE, 3, rowElements(START_SUDOKU2, 1, 2))).to.be.true;
      expect(okInRow(ONE, 1, rowElements(START_SUDOKU2, 1, 2))).to.be.false;
      expect(okInRow(ONE, 3, rowElements(START_SUDOKU2, 3, 2))).to.be.false;
      expect(okInRow(TWO, 1, rowElements(START_SUDOKU2, 4, 2))).to.be.true;
    });
    it('a candidate fits in a column', () => {
      expect(okInColumn(ONE, 1, columnElements(START_SUDOKU, 1))).to.be.false;
      expect(okInColumn(ONE, 9, columnElements(START_SUDOKU, 1))).to.be.true;
      expect(okInColumn(ONE, 1, columnElements(START_SUDOKU, 8))).to.be.true;
      expect(okInColumn(TWO, 7, columnElements(START_SUDOKU, 9))).to.be.true;
    });
    it('a candidate fits in a column SECTORSIZE 2', () => {
      expect(okInColumn(ONE, 1, columnElements(START_SUDOKU2, 1, 2))).to.be.false;
      expect(okInColumn(TWO, 3, columnElements(START_SUDOKU2, 2, 2))).to.be.true;
      expect(okInColumn(ONE, 1, columnElements(START_SUDOKU2, 3, 2))).to.be.true;
      expect(okInColumn(FOUR, 1, columnElements(START_SUDOKU2, 4, 2))).to.be.false;
    });
    it('a candidate fits in a sector', () => {
      expect(okInSector(ONE, TOP_LEFT3, sectorElements(START_SUDOKU, TOP_LEFT3))).to.be.false;
      expect(okInSector(ONE, BOTTOM_LEFT3, sectorElements(START_SUDOKU, TOP_LEFT3))).to.be.true;
      expect(okInSector(THREE, TOP_LEFT3, sectorElements(START_SUDOKU, BOTTOM_CENTER3))).to.be.true;
      expect(okInSector(NINE, TOP_CENTER3, sectorElements(START_SUDOKU, BOTTOM_CENTER3))).to.be.false;
      expect(okInSector(TWO, TOP_RIGHT3, sectorElements(START_SUDOKU, BOTTOM_RIGHT3))).to.be.false;
      expect(okInSector(ONE, TOP_RIGHT3, sectorElements(START_SUDOKU, BOTTOM_RIGHT3))).to.be.true;
    });
    it('a candidate fits in a sector SECTORSIZE 2', () => {
      expect(okInSector(ONE, TOP_LEFT2, sectorElements(START_SUDOKU2, TOP_LEFT2, 2))).to.be.false;
      expect(okInSector(THREE, BOTTOM_LEFT2, sectorElements(START_SUDOKU2, TOP_LEFT2, 2))).to.be.true;
      expect(okInSector(FOUR, TOP_RIGHT2, sectorElements(START_SUDOKU2, BOTTOM_RIGHT2, 2))).to.be.false;
      expect(okInSector(ONE, TOP_RIGHT2, sectorElements(START_SUDOKU2, BOTTOM_RIGHT2, 2))).to.be.true;
    });
  });
  it('you need to remove faulty candidates', () => {
    expect(removed(START_SUDOKU, 1)).to.eql([0,0,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9]);
    expect(removed(START_SUDOKU, 20)).to.eql([0,5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,0,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9]);
    expect(removed(START_SUDOKU, 80)).to.eql([0,5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,0,9]);
  });
  it('you need to remove faulty candidates SECTORSIZE 2', () => {
    expect(removed(START_SUDOKU2, 1)).to.eql([0,0,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4]);
    expect(removed(START_SUDOKU2, 6)).to.eql([0,2,0,0,0,0,0,0,2,0,0,3,0,0,0,0,4]);
    expect(removed(START_SUDOKU2, 16)).to.eql([0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,0]);
  });
  it('you need to add promising candidates',() => {
    expect(added(START_SUDOKU, 3, FOUR)).to.eql([0,5,3,4,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9]);
    expect(added(START_SUDOKU, 29, THREE)).to.eql([0,5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,3,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9]);
    expect(added(START_SUDOKU, 79, ONE)).to.eql([0,5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,1,7,9]);
  });
  it('you need to add promising candidates SECTORSIZE 2', () => {
    expect(added(START_SUDOKU2, 3, FOUR)).to.eql([0,2,0,4,0,0,1,0,2,0,0,3,0,0,0,0,4]);
    expect(added(START_SUDOKU2, 9, THREE)).to.eql([0,2,0,0,0,0,1,0,2,3,0,3,0,0,0,0,4]);
    expect(added(START_SUDOKU2, 15, ONE)).to.eql([0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,1,4]);
  });
  describe('you gotta check whether a candidate is valid', () => {
    expect(validCandidate(START_SUDOKU, 3, ONE)).to.be.true;
    expect(validCandidate(START_SUDOKU, 71, THREE)).to.be.true;
    expect(validCandidate(START_SUDOKU, 49, FIVE)).to.be.true;
    expect(validCandidate(START_SUDOKU2, 3, ONE, 2)).to.be.true;
    expect(validCandidate(START_SUDOKU2, 13, THREE, 2)).to.be.true;
    expect(validCandidate(START_SUDOKU2, 7, FOUR, 2)).to.be.true;
    expect(validCandidate([0,2,3,0,0,0,1,0,2,0,0,3,0,0,0,0,4], 3, FOUR, 2)).to.be.true;
    it('by checking the rows', () => {
      expect(validCandidate(START_SUDOKU, 3, SEVEN)).to.be.false;
      expect(validCandidate(START_SUDOKU, 71, FOUR)).to.be.false;
      expect(validCandidate(START_SUDOKU, 49, SEVEN)).to.be.false;
    });
    it('by checking the rows SECTORSIZE 2', () => {
      expect(validCandidate(START_SUDOKU2, 3, TWO, 2)).to.be.false;
      expect(validCandidate(START_SUDOKU2, 7, ONE, 2)).to.be.false;
      expect(validCandidate(START_SUDOKU2, 13, FOUR, 2)).to.be.false;
    });
    it('by checking the columns', () => {
      expect(validCandidate(START_SUDOKU, 3, EIGHT)).to.be.false;
      expect(validCandidate(START_SUDOKU, 71, SIX)).to.be.false;
      expect(validCandidate(START_SUDOKU, 49, ONE)).to.be.false;
    });
    it('by checking the columns SECTORSIZE 2', () => {
      expect(validCandidate(START_SUDOKU2, 3, THREE, 2)).to.be.false;
      expect(validCandidate(START_SUDOKU2, 4, FOUR, 2)).to.be.false;
      expect(validCandidate(START_SUDOKU2, 14, ONE, 2)).to.be.false;
    });
    it('by checking the sectors', () => {
      expect(validCandidate(START_SUDOKU, 3, NINE)).to.be.false;
      expect(validCandidate(START_SUDOKU, 71, TWO)).to.be.false;
      expect(validCandidate(START_SUDOKU, 49, THREE)).to.be.false;
    });
    describe('you gotta be able to go one step further with function "sudoku"', () => {
      it('when the position to try is already filled', () => {
        expect(sudoku({
          startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          cells: [0,2,3,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          position: 1,
          candidate: 'whatever',
        })).to.eql({
          startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          cells: [0,2,3,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          position: 2,
          candidate: 1,
        });
      });
      it('when the cells are all allocated', () => {
        expect(sudoku({
          startCells: WHOLE_SUDOKU2.slice(),
          cells: WHOLE_SUDOKU2.slice(),
          position: 17,
          candidate: 'whatever',
        })).to.eql('|2 4|1 3|\n|3 1|4 2|\n --- --- \n|4 2|3 1|\n|1 3|2 4|');
      });
      describe('when all candidates do not fit a given position', () => {
        it('starting to backtrack', () => {
          expect(sudoku({
            startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 2,
            candidate: 5,
          })).to.eql({
            startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 1,
            candidate: 3,
            backtracking: true,
          });
        });
        it('continuing to backtrack', () => {
          expect(sudoku({
            startCells: [0,2,0,1,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,3,1,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 3,
            candidate: 'whatever',
            backtracking: true,
          })).to.eql({
            startCells: [0,2,0,1,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,3,1,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 2,
            candidate: 4,
            backtracking: true,
          });
        });
      });
      it('when a valid candidate is found', () => {
        expect(sudoku({
          startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          cells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          position: 2,
          candidate: 3,
        })).to.eql({
          startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          cells: [0,2,3,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
          position: 3,
          candidate: 1,
        });
      });
      describe('when a candidate fails to fill the position', () => {
        it('by failing the row', () => {
          expect(sudoku({
            startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 2,
            candidate: 2,
          })).to.eql({
            startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 2,
            candidate: 3,
          });
          expect(sudoku({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 9,
            candidate: 7,
          })).to.eql({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 9,
            candidate: 8,
          });
        });
        it('by failing the column', () => {
          expect(sudoku({
            startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 9,
            candidate: 2,
          })).to.eql({
            startCells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            cells: [0,2,0,0,0,0,1,0,2,0,0,3,0,0,0,0,4],
            position: 9,
            candidate: 3,
          });
          expect(sudoku({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 24,
            candidate: 9,
          })).to.eql({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 24,
            candidate: 10,
          });
        });
        it('by failing the sector', () => {
          expect(sudoku({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 3,
            candidate: 6,
          })).to.eql({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 3,
            candidate: 7,
          });
          expect(sudoku({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 73,
            candidate: 6,
          })).to.eql({
            startCells: START_SUDOKU.slice(),
            cells: START_SUDOKU.slice(),
            position: 73,
            candidate: 7,
          });
        });
      });
    });
  });
});

describe('to print a sudoku board', () => {
  it('you need a dumper', () => {
    expect(dumper([0,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9]))
      .to.
      eql('|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n ----- ----- ----- \n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n ----- ----- ----- \n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|');
    expect(dumper([0,1,2,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9,1,0,3,4,0,6,7,0,9]))
      .to.eql('|1 2 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n ----- ----- ----- \n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n ----- ----- ----- \n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|\n|1 _ 3|4 _ 6|7 _ 9|');
    expect(dumper(START_SUDOKU2, 2))
      .to.eql('|2 _|_ _|\n|_ 1|_ 2|\n --- --- \n|_ _|3 _|\n|_ _|_ 4|');
  });
});

describe('to solve a sudoku 2x2', () => {
  it('you need an executor', () => {
    executor({
      startCells: START_SUDOKU2.slice(),
      cells: START_SUDOKU2.slice(),
      position: 1,
      candidate: 1,
    }, 2);
  });
});

describe('to solve a sudoku 3x3', () => {
  it('you need an executor', () => {
    executor({
      startCells: START_SUDOKU.slice(),
      cells: START_SUDOKU.slice(),
      position: 1,
      candidate: 1,
    }, 3);
  });
});

let STARTMILLIS;
let ENDMILLIS;

describe.only('to solve the hardest sudoku', () => {
  it('you need an executor', () => {
    STARTMILLIS = new Date().getTime();
    executor({
      startCells: HARDEST_SUDOKU.slice(),
      cells: HARDEST_SUDOKU.slice(),
      position: 1,
      candidate: 1,
      STARTMILLIS,
      ENDMILLIS,
    }, 3);
  });
});

describe('to solve the lost sudoku', () => {
  it('you need an executor', () => {
    executor({
      startCells: LOST_SUDOKU.slice(),
      cells: LOST_SUDOKU.slice(),
      position: 1,
      candidate: 1,
      STARTMILLIS,
      ENDMILLIS,
    }, 3);
  });
});
