var boats = [];
let finished = false;

function Boat(id, distance, rotation, zrotation, name) {
  this.id = id;
  this.distance = distance;
  this.rotation = rotation;
  this.zrotation = zrotation;
  this.name = name;
}

var time = 0;

const fs = require('fs');
const http = require('http');
const https = require('https');
var express = require('express');
require('dotenv').config();


var app = express();

app.use(express.static(__dirname, { dotfiles: 'allow'} ));
app.use(express.static('public'));



if(process.env.NODE_ENV === "development"){
  let server = app.listen(process.env.PORT || 3000, listen);

  function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
  }
  var io = require('socket.io')(server);

}else if(process.env.NODE_ENV === "production"){

  const privateKey = fs.readFileSync('/etc/letsencrypt/live/rowflow.rikdewit.nl/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/rowflow.rikdewit.nl/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/rowflow.rikdewit.nl/chain.pem', 'utf8');


  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };


  const httpsServer = https.createServer(credentials, app);


  let sslserver = httpsServer.listen(3000, () => {
    let host = sslserver.address().address;
    let port = sslserver.address().port;
    console.log('Example app listening at https://' + host + ':' + port);
    
  });
  var io = require('socket.io')(sslserver);

}





setInterval(heartbeat, 10);
setInterval(timer, 100);



function heartbeat() {

  io.sockets.emit('heartbeat', boats);
  //console.log(boats)
}

function timer(){
  if(!finished){
    time += 0.1;
  }
  io.sockets.emit('timer', time);
  // console.log(time)
}

function restart(){
  console.log("restart");
  io.sockets.emit('restart');
  for (let i = 0; i<boats.length; i++) {


    

    let boat = boats[i];
    boat.distance = 0;
    boat.rotation = 0;
    boat.zrotation = 0;
    boat.finished = false;
    finished = false;
    time = 0;

  }
}

function won(boat, time){
  io.sockets.emit('won', boat, time);
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
          boat.name = data.name;
        }

        if(boat.finished && !finished){
          console.log("Boat finished! "+ boat.name + " " + boat.id);
          finished = true;
          won(boat, time);
          setTimeout(restart, 3000);
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

});
