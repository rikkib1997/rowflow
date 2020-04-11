var boats = [];
let finished = false;

function Boat(id, distance, rotation, zrotation) {
  this.id = id;
  this.distance = distance;
  this.rotation = rotation;
  this.zrotation = zrotation;
}

var time = 0;

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
setInterval(timer, 100);



function heartbeat() {

  io.sockets.emit('heartbeat', boats);
}

function timer(){
  time += 0.1;
  io.sockets.emit('timer', time);
}

io.sockets.on(
  'connection',
  function(socket) {
    console.log('We have a new client: ' + socket.id);

    socket.on('start', function(data) {
      let boat = new Boat(socket.id, data.distance);
      boats.push(boat);
    });

    socket.on('update', function(data) {
      for (let i = 0; i<boats.length; i++) {
        let boat = boats[i];
        if (socket.id == boat.id) {
         
          boat.distance = data.distance;
          boat.rotation = data.rotation;
          boat.zrotation = data.zrotation;
          boat.finished = data.finished;
      }
      
      if(boat.finished && !finished){
        console.log("Boat finished! "+ boat.id);
        finished = true;
      }
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
