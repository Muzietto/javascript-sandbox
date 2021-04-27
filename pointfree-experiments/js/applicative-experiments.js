// https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch10
C('------------- APPLICATIVE EXPERIMENTS --------------');

const add = x => y => x + y;

const Madd = Maybe.of(add);

C('Maybe.of(add).ap(Maybe.of(2)).ap(Maybe.of(3))');
C(Madd.ap(Maybe.of(2)).ap(Maybe.of(3)));

const Eadd = Either.of(add);

C('Either.of(add).ap(Either.of(2)).ap(Either.of(3))');
C(Eadd.ap(Either.of(2)).ap(Either.of(3)));

C('Either.of(add).ap(Either.of(2)).ap(Either.of(null))');
C(Eadd.ap(Either.of(2)).ap(Either.of(null)));

C('Either.of(add).ap(Either.of(null)).ap(Either.of(3))');
C(Eadd.ap(Either.of(null)).ap(Either.of(3)));
