const { task, of } = folktale.concurrency.task;
const C = console.log;

const traceTask = tag => x => task(({ resolve }) => {
    console.log(`${tag} --> ${JSON.stringify(x)}`);
    resolve(x);
})

C('------------- TASK EXPERIMENTS --------------');
/*
resolver === {
  cancel: ƒ (e)
  cleanup: ƒ (n)
  isCancelled: (...)
  onCancelled: ƒ (n)
  reject: ƒ (e)
  resolve: ƒ (e)
}
*/
const delay = (ms) => task(
  (resolver) => {
    const timerId = setTimeout(() => resolver.resolve(ms), ms);
    resolver.cleanup(() => {
      clearTimeout(timerId);
    });
  }
);

// waits 100ms
const delayedResult = (a, b) => delay(a)
  .or(delay(b))

delayedResult(100, 200)
  .run()
  .promise()
  .then(trace('delay(100).or(delay(200))'));

delayedResult(200, 100)
  .run()
  .promise()
  .then(trace('delay(200).or(delay(100))'));

function getJSON(url) {
  return task(({
    resolve,
    reject,
    cancel,
    cleanup,
    isCancelled,
    onCancelled,
  }) => {
    $.ajax({
      url: url,
      type: 'GET',
      error: reject, // it rejects on error
      success: resolve, // it resolves the json data
    })
  })
}

function wait(duration, value) {
  return task(({ resolve }) => {
    setTimeout(() => {
      resolve(value)
    }, duration)
  })
}

const photosUrl = '/photos/';

const getto = getJSON(`https://jsonplaceholder.typicode.com${photosUrl}`);

const myTask = getto
  .chain(photos => {
    const id = photos[0].id
    return wait(1000, id)
  })
  .chain(id => getJSON(`https://jsonplaceholder.typicode.com${photosUrl}/${id}`))
  .chain(traceTask('single photo'))

// Now we run it
myTask
  .run().promise()
  .then(console.log)
  .catch(console.error);

const galleryTemplate = `{{#each pictures}}
    <b>{{this.title}}</b><br/><img src="{{this.thumbnailUrl}}"/><hr/>
  {{/each}}`;

// -- Pure application -------------------------------------------------
// galleryPage :: Pictures -> HTML
const galleryPage = Handlebars.compile(galleryTemplate);

// renderPage :: Pictures -> HTML
const renderedPage = compose(xs => galleryPage({pictures:xs}), take(4)/*, sortBy(prop('date'))*/);

// gallery :: Params -> Task Error HTML
// const gallery = compose(map(renderedPage), getJSON(`https://jsonplaceholder.typicode.com${photosUrl}`));
const gallery = getJSON(`https://jsonplaceholder.typicode.com${photosUrl}`)
  .chain(tasked(renderedPage));

function tasked(fn) {
  return x => task(({resolve}) => resolve(fn(x)));
}

// -- Impure calling code ----------------------------------------------
gallery
  .run().promise()
  .then(page => { $('#mainDiv').html(page); })
  .catch(error => { $('#errorDiv').html(error.message); });

// check also fromPromised --> https://folktale.origamitower.com/api/v2.0.0/en/folktale.concurrency.task.frompromised.html

// getJSON2 :: String -> Task Left Right
function getJSON2(url) {
  return task(({
    resolve,
    reject,
    cancel,
    cleanup,
    isCancelled,
    onCancelled,
  }) => {
    $.ajax({
      url: url,
      type: 'GET',
      // error: (xhr, textStatus, errorThrown) => { debugger; },
      // error: err => resolve(left(JSON.stringify(err))), // it rejects on error
      error: compose(resolve, left, JSON.stringify),
      // success: data => resolve(right(data)) // it resolves the json data
      success: compose(resolve, right),
    })
  })
}

const isEven = num => getJSON2(`https://api.isevenapi.xyz/api/iseven${Math.random() > 0.5 ? 'XXX' : ''}/${num}`);

const add = x => y => x + y;

C('of(add).ap(of(2)).ap(of(3))');
C(of(add).ap(of(2)).ap(of(3)).run().promise());
