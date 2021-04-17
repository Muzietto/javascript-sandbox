
// https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch09
C('------------- MONADIC EXPERIMENTS --------------');

// safeHead :: [a] -> Maybe a
const safeHead = safeProp(0);

// firstAddressStreet :: User -> Maybe (Maybe (Maybe Street))
const firstAddressStreet = compose(
  lift(lift(safeProp('street'))),
  lift(safeHead),
  safeProp('addresses'),
);

C("firstAddressStreet({addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }] })");
C(firstAddressStreet({
  addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
}));
// Maybe(Maybe(Maybe({name: 'Mulburry', number: 8402})))

const monadicFirstAddress = x => safeProp('addresses')(x)
  .trace('aa')
  .bind(safeHead)
  .trace('sh')
  .bind(safeProp('street'));

C("monadicFirstAddress({addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }] })");
C(monadicFirstAddress({
  addresses: [
    { street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' },
    { street: { name: 'Gramsci', number: 9 }, postcode: '20154' },
  ],
}));
