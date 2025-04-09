import pkg from 'chai';
const { expect } = pkg;

import { add } from '../src/test-deploy';

describe('the adder', function () {
  it('can add', () => {
    expect(add(1, 2)).to.eql(3);
  });
});