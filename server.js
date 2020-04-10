var boats = [];

function Boat(id, distance, rotation, zrotation) {
  this.id = id;
  this.distance = distance;
  this.rotation = rotation;
  this.zrotation = zrotation;
}

var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

setInterval(heartbeat, 10);

function heartbeat() {
  io.sockets.emit('heartbeat', boats);
}

io.sockets.on(
  'connection',
  function(socket) {
    console.log('We have a new client: ' + socket.id);

    socket.on('start', function(data) {
      console.log("start");
      console.log(socket.id + ' ' + data.distance);
      var boat = new Boat(socket.id, data.distance);
      boats.push(boat);
      console.log(boats.length);
    });

    socket.on('update', function(data) {
      var boat;
      for (var i = 0; i < boats.length; i++) {
        if (socket.id == boats[i].id) {
          boat = boats[i];
        }
      }
      if(boat){
        boat.distance = data.distance;
        boat.rotation = data.rotation;
        boat.zrotation = data.zrotation;
        

      }
    });

    socket.on('disconnect', function() {
      console.log('Client has disconnected ' + socket.id);      
      
          for(var i = 0; i < boats.length; i++){
              
              if(socket.id === boats[i].id){
                  boats.splice(i, 1);
              }
          }
    });
  }
);
