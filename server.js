'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

const router1 = require('./router1');
const router2 = require('./router2');

app.use(morgan('common')); // log the http layer

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/endpoint1', router1);
app.use('/endpoint2', router2);

let server; // declare `server` here, then runServer assigns a value.

function runServer() { // start server and return a Promise.  
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() { // close server and return a Promise.
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => { // `server.close` does not natively return a promise, so we manually create one
      if (err) {
        reject(err);
        return; // so we don't also call resolve()     
      }
      resolve();
    });
  });
}

if (require.main === module) { // i.e. if server.js is called directly (so indirect calls, such as testing, don't run this)
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
