const fs = require('fs');
const http = require('http');
const https = require('https');
let express = require('express');
require('dotenv').config();


let app = express();

app.use(express.static(__dirname, { dotfiles: 'allow'} ));
app.use(express.static('public'));

let io;

if(process.env.NODE_ENV === "development"){
  let port = process.env.PORT || 3000
  let server = app.listen(port, listen);

  function listen() {
    
    console.log(`Example app listening at: "localhost:${port}"`);
  }
  io = require('socket.io')(server);

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
  io = require('socket.io')(sslserver);

}

exports.io = io;
