try {
  const C = console.log;
} catch (ex) {}

C('------------- Y-COMBINATOR EXPERIMENTS --------------');
const exxxxp = (myself, x, n) => {
  if (n === 0) {
    return 1;
  } else if (n % 2 === 1) {
    return x * myself(x * x, Math.floor(n / 2));
  } else {
    return myself(x * x, n / 2);
  }
};

// maker is a function that takes one or more parameters
// and returns a function that looks like (...args) => fn(maker(??), ...args).
// That’s the function we want to pass to fn as myself.
const why = fn => // fn :: (myself, ...args) -> myself(args)
  (
    maker => // passed by the IIFE down there
      (...args) =>
        fn(maker(maker), ...args) // maker(maker) gets rid of MAKER before recurring
  )
  (
    MAKER =>
      (...ARGS) =>
        fn(MAKER(MAKER), ...ARGS)
  );

C('exxxxp :: (myself, ...args) -> myself(args)');
C('why(exxxxp)(2,8)');
C(why(exxxxp)(2,8));

// reducing the expressions a bit...
// const why1 = fn => // fn :: (myself, ...args) -> myself(args)
//   ( //   (MAKER => (...ARGS) => fn(MAKER(MAKER), ...ARGS)) at the place of maker
//          produces a nested cascading effect each time that fn runs
//       (...args) =>
//         fn((...ARGS) => fn((...ARGS) => fn((...ARGS) => fn((...ARGS) => fn(MAKER(MAKER), ...ARGS), ...ARGS), ...ARGS), ...ARGS), ...args)
//   );

// Y-combinator using the mockingbird
const whyM =
  fn =>
    (x => x(x))( // this is "mockingbird("
      MAKER =>
        (...ARGS) =>
          fn(MAKER(MAKER), ...ARGS)
    );

C('whyM(exxxxp)(2,8)');
C(whyM(exxxxp)(2,8));

// reducing the expressions a bit...
// const whyM1 =
//   fn =>
//     (
//       (MAKER => (...ARGS) => fn(MAKER(MAKER), ...ARGS))
//         (MAKER2 => (...ARGS2) => fn(MAKER2(MAKER2), ...ARGS2))
//     );
//
// const whyM2 = // <-- same as why1
//   fn =>
//     (
//       (...ARGS) =>
//         fn((...ARGS2) => fn((...ARGS2) => fn((...ARGS2) => fn((...ARGS2) => fn(MAKER2(MAKER2), ...ARGS2), ...ARGS2), ...ARGS2), ...ARGS2), ...ARGS)
//     );
// THIS MEANS THAT...
// the essence of (maker => (...args) => fn(maker(maker), ...args))
// is (x => x(x))
