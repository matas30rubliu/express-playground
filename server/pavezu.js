const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const OauthStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser');

const keys = require('../config/keys.js');
const utils = require('./utils.js');

const portForHeroku = process.env.PORT || 5000;
const moment = require('moment');

require('./models/Route.js');
// Execute 'users' collection creation in User.js
require('./models/User.js');
// Create MongoDB at mlab.com
mongoose.connect(keys.mongoDB);

// API reference for HTTP server: https://expressjs.com/
const app = express();

app.use(bodyParser.json());

// passport can keep track of auth flow in many ways. E.g. by cookies.
// By default exress does not know about cookies, init that:
app.use(cookieSession({
  // Define how long the cookie lives. 30 days
  maxAge: 30 * 24 * 60 * 60 * 1000,
  // Key to encript the cookie
  keys: [keys.cookieKey]
}));
// Use cookies to handle auth
app.use(passport.initialize());
app.use(passport.session());

const http = require('http');
const socketIO = require('socket.io');
var server = http.createServer(app);
var io = socketIO(server);
// const io = require('socket.io')();

io.on('connection', socket => {
  socket.on('newRoute', newRoute => {
    socket.broadcast.emit('newRoute', newRoute);
  });
});

passport.serializeUser((user, done) => {
  // first param is error object (null because we expect no errors)
  // This creates cookie, which is used by our app
  done(null, user);
  // Consideration for user.id - now it is google profile id. If we have facebook, twitter etc. auth, we wouldn't have that id.
  // We should have DB where users are stored and user.id should be id of entry in DB
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const User = mongoose.model('users');
// http://passportjs.org/
// Create google project at http://console.developers.google.com and generate credentials for Google+ API
// Both public and private tokens are stored in ../config/keys.js for dev environment, for prod we use env variables
passport.use(
  new OauthStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      //callbackURL has to registered in http://console.developers.google.com project to work
      callbackURL: '/auth/google/redirect',
      // Trust proxies, so we can use heroku
      proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
      const persistedUser = await User.findOneAndUpdate(
        { googleProfileID: profile.id },
        { lastSeen: moment().toDate() },
        { upsert: true, new: true });
        console.log(persistedUser);
      done(null, { id: persistedUser.id, from: profile.name.givenName, message: `${profile.displayName} logged in at ${moment().format('MMMM Do YYYY, h:mm:ss a')}` });
    }
  )
);

// Express routes (application end points - URIs).
// TODO: Refactor to different file
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get(
  '/auth/google/redirect',
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/google"
  })
);

// this call returns current user. req.user is set by deserializeUser
app.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

const Route = mongoose.model('routes');
app.post('/api/addRoute', async (req, res) => {
  // save route added by user to MongoDB models/Route collection
  const {from, to} = req.body;
  const newRoute = new Route({
    userID: req.user.id,
    from,
    to,
    firstRegistered: moment().toDate()
  });
  try {
    await newRoute.save();
    const routes = await Route
      .find({})
      .sort({'firstRegistered': -1})
      .limit(15)
      .exec((err, res) => {
        if (err) {
          console.log(err);
        }
      });
    res.send(routes);
  } catch (err) {
    res.status(422).send(err);
  }
});

app.get('/api/getRoutes', async (req, res) => {
  const routes = await Route
    .find({})
    .sort({'firstRegistered': -1})
    .limit(15)
    .exec((err, res) => {
      if (err) {
        console.log(err);
      }
    });
  res.send(routes);
});

if (process.env.NODE_ENV === 'production') {
    // serve main.js and main.css (from ./client/build/static/... after running npm run build) for prod
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'client/build')));

    // serve index.html if route requested is supposed to be handled by react
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

server.listen(portForHeroku, () => {
  console.log(`Server started on port ${portForHeroku}`);
});
