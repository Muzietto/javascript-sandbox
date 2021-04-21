const { task } = folktale.concurrency.task;
const C = console.log;

const traceTask = tag => x => task(({ resolve }) => {
    console.log(`${tag} --> ${JSON.stringify(x)}`);
    resolve(x);
})

C('------------- TASK EXPERIMENTS --------------');

const delay = (ms) => task(
  (resolver) => { // resolver === {resolve, reject,cleanup}
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
  return task(({ resolve, reject }) => {
    $.ajax({
      url: url,
      type: 'GET',
      error: reject, // it rejects on error
      success: resolve // it resolves the json data
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
const renderedPage = compose(xs => galleryPage({pictures:xs}), take(10)/*, sortBy(prop('date'))*/);

// gallery :: Params -> Task Error HTML
// const gallery = compose(map(renderedPage), getJSON(`https://jsonplaceholder.typicode.com${photosUrl}`));
const gallery = getJSON(`https://jsonplaceholder.typicode.com${photosUrl}`)
  .chain(x => task(({resolve}) => resolve(renderedPage(x))));

// -- Impure calling code ----------------------------------------------
gallery
  .run().promise()
  .then(page => { $('#mainDiv').html(page); })
  .catch(error => { $('#errorDiv').html(error.message); });

// $('#spinner').show();
