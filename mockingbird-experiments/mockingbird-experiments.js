try {
  const C = console.log;
} catch (ex) {}

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

C(curriedExponential(curriedExponential)(2)(3)); // that's 8

// curried mockingbird
const M = fn => fn(fn); // curried functions may omit next param

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

C(uncurriedExponential(uncurriedExponential, 2, 3)); // that's 8

// uncurried mockingbird
const Mm = fn => (...args) => fn(fn, ...args) // uncurried functions must explicit next params

C(Mm(uncurriedExponential)(2,3)); // that's 8
