import { expect } from 'chai';
import {
  pippo,
  game,
} from '../src/bowling.js';

describe('to play bowling', () => {
  xit('you need pippo', () => {
    expect(pippo).to.eql(123);
  });

  xit('you throw one ball and score 6 points', () => {
    const score = game('6')();
    expect(score).to.eql(6);
  });

  it('you throw two balls with one string and score 6+3 points', () => {
    const score = game('6.3')();
    expect(score).to.eql(6 + 3);
  });

  xit('you throw one impossible ball and score an error message', () => {
    const score = game('16')();
    expect(score).to.eql('ERROR: TOO MANY PINS IN ONE ROLL');
  });

  xit('you throw two impossible balls and score an error message', () => {
    const score = game('8.8')();
    expect(score).to.eql('ERROR: TOO MANY PINS IN ONE TURN');
  });
});
