const C = console.log;

C('------------- COMPOSE EXPERIMENTS --------------');

C('compose(x => 2*x, x => 2+x)(1)');
C(compose(x => 2*x, x => 2+x)(1));

C('compose(x => 2+x, (x,y) => x+y)(1,2)');
C(compose(x => 2+x, (x,y) => x+y)(1,2));

C('compose(([x,y]) => 2+x+y, (x,y) => ([x+y, x*y]))(1,2)');
C(compose(([x,y]) => 2+x+y, (x,y) => ([x+y, x*y]))(1,2));

// C('------------- COMPOSE FUNCTOR EXPERIMENTS --------------');
// const tmd = Task.of(Maybe.of('Rock over London'));
//
// const ctmd = Compose.of(tmd);
//
// const ctmd2 = map(append(', rock on, Chicago'), ctmd);
// // Compose(Task(Just('Rock over London, rock on, Chicago')))
//
// ctmd2.getCompose;
