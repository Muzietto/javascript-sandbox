// https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch08#exercises

C('-------------EXERCISES --------------');
// incrF :: Functor f => f Int -> f Int
const incrF = f1 => f1.map(x => x + 1);

C('incrF(Maybe.of(1)).$value --> 2')
C(incrF(Maybe.of(1)).$value);

const user = { id: 2, name: 'Albert', active: true };
const initial = compose(lift(head), safeProp('name'));

C('initial(user).$value --> A');
C(initial(user).$value);

// showWelcome :: User -> String
const showWelcome = compose(prepend('Welcome '), prop('name'));

// checkActive :: User -> Either String User
const checkActive = function checkActive(user) {
  return user.active
    ? Either.of(user)
    : left('Your account is not active');
};

// eitherWelcome :: User -> Either String String
const eitherWelcome = compose(lift(showWelcome), checkActive);

C('eitherWelcome(user) --> Right(Welcome Albert)');
C(eitherWelcome(user));

C('eitherWelcome({ active: false }) --> Left(Your account is not active)');
C(eitherWelcome({ active: false }));
