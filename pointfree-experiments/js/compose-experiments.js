const C = console.log;

C('------------- COMPOSE EXPERIMENTS --------------');

C('compose(x => 2*x, x => 2+x)(1)');
C(compose(x => 2*x, x => 2+x)(1));

C('compose(x => 2+x, (x,y) => x+y)(1,2)');
C(compose(x => 2+x, (x,y) => x+y)(1,2));

C('compose(([x,y]) => 2+x+y, (x,y) => ([x+y, x*y]))(1,2)');
C(compose(([x,y]) => 2+x+y, (x,y) => ([x+y, x*y]))(1,2));

C('------------- MAKING SURE FOLKTALE WORKS --------------');

const inc = x => x + 1;
const double = x => x * 2;

// Global variable
const globalized = folktale.maybe.Just(1)
  .map(folktale.core.lambda.compose(double, inc));
C(`globalized=${globalized}`);

// Property in the window object
const windowized = window.folktale.maybe.Just(1)
  .map(window.folktale.core.lambda.compose(double, inc));
C(`windowized=${windowized}`);
