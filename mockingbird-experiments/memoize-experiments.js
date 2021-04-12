try {
  const C = console.log;
} catch (ex) {}
const J = JSON.stringify;

C('------------- MEMOIZE EXPERIMENTS --------------');

// horrible! - name is hardcoded
const exponential = (x, n) => {
  console.log(`exponential ${x} ${n}`);
  if (n === 0) {
    return 1;
  } else if (n % 2 === 1) {
    return x * exponential(x * x, Math.floor(n / 2));
  } else {
    return exponential(x * x, n / 2);
  }
};

const memoized = (fn, keymaker) => {
  const dict = new Set();

  return  (...args) => {
    // no spread op => array is passed as single argument
    const key = keymaker(args);
    C(`key=${key}`);

    if (dict[key]) {
      C(`found key ${key}`);
      return dict[key];
    }

    return (dict[key] = fn(...args))
  };
};

const mExp = memoized(exponential, J);

// C(mExp(2,3));

// better: recurs on 'myself'
const exponential2 = (myself, x, n) => {
  console.log(`exponential2 ${x} ${n}`);
  if (n === 0) {
    return 1;
  } else if (n % 2 === 1) {
    return x * myself(myself, x * x, Math.floor(n / 2));
  } else {
    return myself(myself, x * x, n / 2);
  }
};

const mExp2 = memoized(exponential2, J);

C('memoized(exponential2, J)(exponential2,2,8)');
C(mExp2(exponential2,2,8));
C('memoized(exponential2, J)(exponential2,4,4) <-- cannot build on previous computation');
C(mExp2(exponential2,4,4));

const mExp2b = memoized(exponential2, J);

C('Quantum Leap!!! pass the memoized function as "myself"');
C('memoized(exponential2, J)(memoized(exponential2),2,8)');
C(mExp2b(mExp2b,2,8));
C('memoized(exponential2, J)(memoized(exponential2),4,4) <-- builds on previous computation');
C(mExp2b(mExp2b,4,4));

// uncurried mockingbird
const uM = fn => (...args) => fn(fn, ...args); // uncurried functions must explicit next params

C('Enter the mockingbird!!! uM = fn => (...args) => fn(fn, ...args)');

const mbExp = uM(exponential2);

C('uM(exponential2)(2,3) <-- no need to repeat exponential2 in the further args list');
C(mbExp(2,3));

const mbMemExp = uM(memoized(exponential2, J));

C('uM(memoized(exponential2, J))(2,8) <-- mention memoized(exponential2) just once');
C(mbMemExp(2,8));
C('uM(memoized(exponential2, J))(4,4) <-- builds on previous computation');
C(mbMemExp(4,4));
