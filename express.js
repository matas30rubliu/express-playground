const express = require('express');
const hbs = require('hbs');
// my file system
const os = require('os');
const fs = require('fs');

const portForHeroku = process.env.PORT || 3000;

// API reference @ https://expressjs.com/
var app = express();

// location that stores reusable page elemetents
hbs.registerPartials(__dirname + '/views/partials');


// my custom middleware, which logs every request
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('express.js.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to write to file express.js.log');
    }
  });
  next();
});

// Does not call next()
// app.use((req, res, next) => {
//   res.send('Site is being updated...')
// });

// set middleware: express.static allows to GET resources like ./infoPage.html
app.use(express.static(__dirname + '/'));

app.set('view engine', 'hbs');

// pass this value via response on render or use hbs.registerHelper to register function that can be called inside hbs files
var currentYear = new Date().getFullYear();

hbs.registerHelper('eGolfInfo', () => {
  return 'The Golf blue-e-motion concept has a range of 150 km. '
  + 'The Golf blue-emotion concept has a 26.5 kWh lithium-ion battery pack and is powered by an 85 kW electric motor. '
  + 'It will accelerate to 100 km/h (62 mph) in 11.8 seconds and have a top speed of 138 km/h (86 mph).';
});

app.get('/', (req, res) => {
  res.render('firstPage.hbs', {
    title: 'Greetings from ' + __dirname,
    prop1: 5+1,
    year: currentYear
  });
});

app.get('/secondPage', (req, res) => {
  res.render('secondPage.hbs', {
    title: 'Your user name: ' + os.userInfo().username,
    prop1: 8+12,
    year: currentYear
  });
});

app.get('/matas', (req, res) => {
  res.send({
  name: 'Matas',
  surname: 'Lileikis',
  age: 23});
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
