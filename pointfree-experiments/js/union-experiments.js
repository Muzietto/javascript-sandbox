
C('------------- UNION EXPERIMENTS --------------');

const { union } = folktale.adt.union;

const TaskOutcome = union('TaskOutcome', {
  Cancelled() { return 'cancelled'; },
  Rejected(reason) { return reason; },
  Resolved(value) { return value; },
});

myTask
  .orElse(reason => {
    throw 'badabùm';
  })
  .run()
  .promise()
  .catch(console.error);



// don't use listen!!! (https://gitter.im/folktale/discussion?at=588efdf6c0f28dd8625df50c)
// myTask.run().listen({
//   onCancelled: () => {debugger;return of(TaskOutcome.Cancelled());},
//   onRejected:  reason => {debugger;return of(TaskOutcome.Rejected(JSON.stringify(reason)))},
//   onResolved:  value => {debugger;return of(TaskOutcome.Resolved(value));}
// }).promise()
//   .then(x => {debugger;console.log(x);})
//   .catch(console.error);
