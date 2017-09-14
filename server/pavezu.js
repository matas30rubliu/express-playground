const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const passport = require('passport');
const OauthStrategy = require('passport-google-oauth20').Strategy;

const keys = require('../config/keys.js');
const utils = require('./utils.js');

const portForHeroku = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

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
app.use(passport.initialize());

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
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
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
      done(null, { id: profile.id, from: profile.name.givenName, message: `New User logged in ${profile.displayName}` });
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
    failureRedirect: "/login"
  })
);

server.listen(portForHeroku, () => {
  console.log(`Server started on port ${portForHeroku}`);
});
