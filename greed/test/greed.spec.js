import pkg from 'chai';
const { expect } = pkg;

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      expect([1, 2, 3].indexOf(4)).to.eql(-10);
    });
  });
});