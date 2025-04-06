import { expect } from 'chai';
import {
  pippo
} from '../src/bowling.js';

describe('to play bowling', () => {
  it('you need pippo', () => {
      expect(pippo).to.eql(123);
  });
});
