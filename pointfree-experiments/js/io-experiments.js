C('-------------IO EXPERIMENTS --------------');

// ioWindow :: IO Window
const ioWindow = IO.of(window);

C('ioWindow.map(win => win.innerWidth).run() --> window.innerWidth');
ioWindow.map(win => win.innerWidth).run();
// IO(1430)

C(ioWindow
  .map(prop('location'))
  .map(prop('href'))
  .map(split('/'))
  .run());
// IO(['http:', '', 'localhost:8000', 'blog', 'posts'])

// $ :: String -> IO [DOM]
const $ = selector => new IO(() => document.querySelectorAll(selector));

C("$('#myDiv').map(head).map(div => div.innerHTML).run() --> 'pointfree-experiments'");
C($('#myDiv').map(head).map(x => { return prop('innerHTML')(x); }).run());
// IO('I am some inner html')
