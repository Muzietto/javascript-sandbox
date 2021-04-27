// https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch05
// compose :: ((y -> z), (x -> y),  ..., (a -> b)) -> a -> z
const compose = (...fns) =>
  (...args/* of last fn*/) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

const c2 = (...fns) =>
  (...args/* of last fn*/) =>
    fns.reduce((res, fn) => [fn.call(null, ...res)], args)[0];

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

const identity = x => x;

const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const take = n => xs => xs.slice(0, n);

function prop(propName) {
  return obj => obj[propName];
}

function split(divider) {
  return string => string.split(divider);
}

function head(arra) {
  return arra[0];
}

function reduce(f, start) {
  return arra => arra.reduce(f, start);
}

function prepend(x) {
  return str => x.concat(str);
}

function append(x) {
  return str => str.concat(x);
}

const reverse = reduce((acc, x) => [x, ...acc], []);
const last = compose(head, reverse);

// chain :: Monad m => (a -> m b) -> m a -> m b
const chain = famb => compose(join, map(famb));

// lift :: (a -> b) => Functor fa => Functor Fb
const lift = fab => fa => fa.map(fab);

class IO {
  static of(x) {
    return new IO(() => x);
  }

  constructor(fn) {
    this.unsafePerformIO = fn;
  }

  map(fn) {
    return new IO(compose(fn, this.unsafePerformIO));
  }

  fmap(fn) {
    return new IO(compose(fn, this.unsafePerformIO));
  }

  bind(famb) {
    return new IO(() => famb(this.unsafePerformIO()))
  }

  join() {
    return this.unsafePerformIO;
  }

  inspect() {
    return `IO(${this.unsafePerformIO})`;
  }

  run() {
    return this.unsafePerformIO();
  }
}

class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  fmap(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  bind(famb = identity) {
    return this.isNothing ? this : famb(this.$value);
  }

  join() {
    return this.isNothing ? Maybe.of(null) : this.$value;
  }

  // "ap-ping a functor of f is equivalent to mapping f"
  ap(applicative) {
    return this.isNothing
      ? this
      : applicative.map(this.$value);
//    : Maybe.of(this.$value(applicative.join()));
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
  }

  trace(tag) {
    trace(tag)(this.$value);
    return this;
  }
}

function safeProp(propName) {
  return obj => {
    return Maybe.of(obj[propName]);
  };
}

class Either {
  static of(x) {
    return (x === null || typeof x === 'undefined')
      ? new Left(`I am ${x}`)
      : new Right(x);
  }

  constructor(x) {
    this.$value = x;
  }
}

class Left extends Either {
  map(f) {
    return this;
  }

  fmap(f) {
    return this;
  }

  bind(famb) {
    return this;
  }

  join() {
    return this.$value;
  }

  ap(applicative) {
    return this;
  }

  orElse(x) {
    return x;
  }

  inspect() {
    return `Left(${inspect(this.$value)})`;
  }
}

class Right extends Either {
  map(f) {
    return Either.of(f(this.$value));
  }

  fmap(f) {
    return Either.of(f(this.$value));
  }

  bind(famb) {
    return famb(this.$value);
  }

  join() {
    return this.$value;
  }

  ap(applicative) {
    return applicative.map(this.$value);
  }

  orElse(x) {
    return this.$value;
  }

  inspect() {
    return `Right(${inspect(this.$value)})`;
  }
}

const right = x => new Right(x);
const left = x => new Left(x);

// either :: (a -> c) -> (b -> c) -> Either a b -> c
const either = curry((f, g, e) => {
  if (e.isLeft) {
    return f(e.$value);
  }

  return g(e.$value);
});

// map :: Functor f => (a -> b) -> f a -> f b
const map = fab => functor => functor.map(fab);
const fmap = fab => functor => functor.map(fab);
const join = monad => monad.join();

// inspect :: a -> String
const inspect = (x) => {
  if (x && typeof x.inspect === 'function') {
    return x.inspect();
  }

  function inspectFn(f) {
    return f.name ? f.name : f.toString();
  }

  function inspectTerm(t) {
    switch (typeof t) {
      case 'string':
        return `'${t}'`;
      case 'object': {
        const ts = Object.keys(t).map(k => [k, inspect(t[k])]);
        return `{${ts.map(kv => kv.join(': ')).join(', ')}}`;
      }
      default:
        return String(t);
    }
  }

  function inspectArgs(args) {
    return Array.isArray(args) ? `[${args.map(inspect).join(', ')}]` : inspectTerm(args);
  }

  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
};

// composed type
class Compose {
  constructor(fgx) {
    this.getCompose = fgx;
  }

  static of(fgx) {
    return new Compose(fgx);
  }

  map(fn) {
    return new Compose(map(map(fn), this.getCompose));
  }
}
