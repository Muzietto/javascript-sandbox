import pkg from 'chai';
const { expect } = pkg;

import { greedSolver } from '../src/greed';

describe('the greedSolver', function () {
  describe('at least', function () {
    xit('has one method', function () {
      expect(greedSolver().test()).to.eql('valueXXX');
    });
  });
  describe('with its method solve', () => {
    it('can find a single 1 in a string', () => {
      const solver = greedSolver();
      const result = solver.solve('10000');
      expect(result).to.eql(100);
    });
    it('can find two 1s in a string', () => {
      const solver = greedSolver();
      const result = solver.solve('10100');
      expect(result).to.eql(200);
    });
    xit('can find a single 5 in a string', () => {
      const solver = greedSolver();
      const result = solver.solve('50000');
      expect(result).to.eql(50);
    });
    xit('can find a 1+5 in a string', () => {
      const solver = greedSolver();
      const result = solver.solve('50001');
      expect(result).to.eql(150);
    });
    xit('can find a simple triple1 in a string', () => {
      const solver = greedSolver();
      const result = solver.solve('11100');
      expect(result).to.eql(1000);
    });
    xit('can find a triple1 hidden in a string', () => {
      const solver = greedSolver();
      const result = solver.solve('10101');
      expect(result).to.eql(1000);
    });
    xit('can apply three rules', () => {
      const solver = greedSolver();
      const result = solver.solve('15111');
      expect(result).to.eql(1150);
    });
    xit('can throw one die', () => {
      const solver = greedSolver();
      const result = solver.solve('6');
      expect(result).to.eql(0);
      const result2 = solver.solve('1');
      expect(result2).to.eql(100);
    });
    xit('can throw six dice', () => {
      const solver = greedSolver();
      const result = solver.solve('555555');
      expect(result).to.eql(0);
      const result2 = solver.solve('111111');
      expect(result2).to.eql(2000);
    });
  });
});