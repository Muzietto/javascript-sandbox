const C = console.log;

C('------------- COMPOSE EXPERIMENTS --------------');

// https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch05
const compose = (...fns) => (...args) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

C('compose(x => 2*x, x => 2+x)(1)');
C(compose(x => 2*x, x => 2+x)(1));

C('compose(x => 2+x, (x,y) => x+y)(1,2)');
C(compose(x => 2+x, (x,y) => x+y)(1,2));

C('compose(([x,y]) => 2+x+y, (x,y) => ([x+y, x*y]))(1,2)');
C(compose(([x,y]) => 2+x+y, (x,y) => ([x+y, x*y]))(1,2));
