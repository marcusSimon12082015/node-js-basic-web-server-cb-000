"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const bcrypt       = require('bcrypt');

const router = new Router({ mergeParams: true });

let messages = [];
let nextId = 1;

class Message {
  constructor(message) {
    this.id = nextId;
    this.message = message;
    nextId++;
  }
}

router.use(bodyParser.json());

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end('Hello, World!');
});

router.post('/message',(request,response) =>{
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  let newMsg = new Message(request.body.message);
  messages.push(newMsg);
  response.end(JSON.stringify(newMsg.id));
});

router.get('/messages',(request,response) => {
  let hashedMessages = JSON.stringify(messages);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request._parsedUrl.query &&
    request._parsedUrl.query.includes('encrypt=true')) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(hashedMessages,10,function(err,hash){
      response.end(hash);
    })
  }

  response.end(hashedMessages);
});


const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
