const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const passport = require('passport');
const cookieSession = require('cookie-session');
const OauthStrategy = require('passport-google-oauth20').Strategy;

const keys = require('../config/keys.js');
const utils = require('./utils.js');

const portForHeroku = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../public');
const moment = require('moment');

// API reference for HTTP server: https://expressjs.com/
// API reference for server that support web sockets: https://socket.io/docs/
var app = express();
// http.createServer() is called by express with app.listen. To configure socket.io, some modifications have to be made.
// By defining this server var we swap app.listen with server.listen.
var server = http.createServer(app);
// Getting web sockets server (it will allow to accept new connections):
var io = socketIO(server);
// Check .../socket.io/socket.io.js - it is library which contains code needed for client to connect to server and transfer data.

app.use(express.static(publicPath));

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

// Registering listener for server. 'connection' is built-in event
io.on('connection', (socket) => {
  console.log('User with socket id %s connected to server', socket.id);

  socket.on('createMessage', (clientMessage) => {
    // When specific client sends new message, publish it to all clients
    io.emit('newMessage', utils.constructMessage(clientMessage.from, clientMessage.message));

    // Broadcasting is similar to io.emit, but socket which emits does not receive its own message
    // socket.broadcast.emit('newMessage', {
    //   from: socket.id,
    //   message: clientMessage.message
    // });

  });

  socket.on('disconnect', () => {
    console.log('User with socket id %s disconnected from server', socket.id);
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
    }, (accessToken, refreshToken, profile, done) => {
      done(null, { id: profile.id, from: profile.name.givenName, message: `${profile.displayName} logged in at ${moment().format('MMMM Do YYYY, h:mm:ss a')}` });
    }
  )
);

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/google"
  })
);

// this call returns current user. req.user is set by deserializeUser
app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

app.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});

if (process.env.NODE_ENV === 'production') {
    // serve main.js and main.css (from ./client/build/static/... after running npm run build) for prod
    app.use(express.static('client/build'));

    // serve index.html if route requested is supposed to be handled by react
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

server.listen(portForHeroku, () => {
  console.log(`Server started on port ${portForHeroku}`);
});
