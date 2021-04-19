// http://raganwald.com/2018/08/30/to-grok-a-mockingbird.html
const C = console.log;

C('------------- MOCKINGBIRD EXPERIMENTS --------------');

// CURRIEDS
// --------
const curriedExponential = myself => x => n => {
  if (n === 0) {
    return 1;
  } else if (n % 2 === 1) {
    return x * myself(myself)(x * x)(Math.floor(n / 2));
  } else {
    return myself(myself)(x * x)(n / 2);
  }
};

C('curriedExponential(curriedExponential)(2)(3)');
C(curriedExponential(curriedExponential)(2)(3)); // that's 8

C('Enter the curried mockingbird!!! M = fn => fn(fn); <-- curried functions may omit next param');
const M = fn => fn(fn); // curried functions may omit next param

C('M(curriedExponential)(2)(3)');
C(M(curriedExponential)(2)(3)); // that's 8

// UNCURRIEDS
// ----------
const uncurriedExponential = (myself, x, n) => {
  if (n === 0) {
    return 1;
  } else if (n % 2 === 1) {
    return x * myself(myself, x * x, Math.floor(n / 2));
  } else {
    return myself(myself, x * x, n / 2);
  }
};

C('uncurriedExponential(uncurriedExponential, 2, 3)');
C(uncurriedExponential(uncurriedExponential, 2, 3)); // that's 8

C('Enter the uncurried mockingbird!!! uncM = fn => (...args) => fn(fn, ...args); <-- uncurried functions must explicit next params');
const uncM = fn => (...args) => fn(fn, ...args) // uncurried functions must explicit next params

C('uncM(uncurriedExponential)(2,3) <-- further args are provided together');
C(uncM(uncurriedExponential)(2,3)); // that's 8

// sub-optimal
const myUncurriedExponential = (myself, x, n) => {
  if (n === 0) return 1;
  return x * myself(myself, x, n - 1);
}

C('uncM(myUncurriedExponential)(2,5) --> 32');
C(uncM(myUncurriedExponential)(2,5)); // that's 32
