const express = require('express');
const Playlist = require('./models/Playlist');
const User = require('./models/User')
const Request = require('./models/Request')
const connect = require('./connect');
const app = express();
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/api/get-playlists/:owner', function(request, response) { //get someones playlists
  let ownerId = request.params.owner;
  let playlist = new Playlist({ owner: ownerId });
  Playlist.where({owner:ownerId}).fetchAll()
    .then(function(playlist) {
      response.json(playlist);
    })
/*  let owner = new User({ id: ownerId });
  owner.fetch()
    .then(function(user) {
      console.log(this);
      if (!user) {
        throw new Error(`User ${ownerId} not found`);
      } else {
        console.log("id " + this.attributes.id);
        let playlist = new Playlist({ owner: ownerId });
        playlist.fetch()
          .then(function(playlist) {
            console.log('here2');
            response.json(playlist)
        }, function(error) {
            response.status(400).json({
              error: error.message
            });
        });
      }
    })
    .catch(function(error) {
      console.log('here1');
    response.status(400).json({
      error: error.message
    });
  });*/
});
// ERROR: fetches only one

app.get('/api/get-playlist-name/:roomCode', function(request, response) { //get name  of playlist
  let roomCode = request.params.roomCode;
  let playlist = new Playlist({ roomCode: roomCode });
  playlist.fetch()
    .then(function(playlist) {
      if (!playlist) {
        throw new Error(`Playlist ${roomCode} doesn't exist`);
      } else {
        response.json({ name: playlist.attributes.playlistName });
      }
    })
    .catch(function(error) {
      response.status(404).json({
        error: error.message
      });
    });
});

app.post('/api/new-user', function(request, response) {
  let id = request.body.id;
  let username = request.body.username;
  let accessToken = request.body.accessToken;
  let expiresAt = request.body.expiresAt;
  if (!id || !username || !accessToken || !expiresAt) {
    response.status(422).json({
      status: 'error',
      error: 'Incomplete data'
    });
  }
  var toSave = new User({
    id: id,
    username: username,
    accessToken: accessToken,
    expiresAt: expiresAt
  });
  toSave.save(null, {method: 'insert'})
    .then(function() {
        response.status(200).json({
          status: 'success'
        });
    }, function(error) {
        response.status(422).json({
          status: 'error',
          error: error.message
        });
    });
});

app.patch('/api/edit-username/:id', function(request, response) {
  let id = request.params.id;
  let newUsername = request.body.username;
  let existanceTest = new User({ id: id });
  existanceTest.fetch()
    .then(function(user) {
      if (!user) {
        response.status(404).json({
          status: 'error',
          error: `Could not find user with id ${id}`
        });
      }
    });
  let userObject = new User
  let toUpdate = userObject.where({id: id});
  toUpdate.save({username: newUsername},{patch:true})
    .then(function(newUser) {
      response.status(200).json({
        status: 'success',
        newUsername: newUser.toJSON().username
      });
    }, function(error) {
        response.status(400).json({
          status: 'error',
          error: error.message
        });
    });
});

app.delete('/api/retract-request/:id', function(request, response) {
  let id = request.params.id;
  let toDestroy = new Request({ id: id});
  toDestroy.destroy()
    .then(function(request) {
        response.status(204).json({
          status: 'success'
        });
    }, function(error) {
        response.status(404).json({
          status: 'error',
          error: `Could not find request with id ${id}`
        });
    })
});

const port = process.env.port || 5000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
