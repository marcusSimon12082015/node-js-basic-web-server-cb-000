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
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(messages));
});

var handler = Router({ mergeParams: true });
router.use('/message/:id', handler);

handler.get('/',(request,response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  let message = messages.find(message => message.id === id);
  if (message === 'undefined') {
    response.status = 404;
    response.statusMessage = "No message found";
    response.end();
    return;
  }
  response.end(JSON.stringify(message));
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
