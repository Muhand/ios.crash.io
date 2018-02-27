const { Router } = require('express');
const socket = require('socket.io');

//Export router
module.exports = ({jobs}) => {
  let api = Router();

  // '/chat'
  api.get('/', (req, res) => {
    socket.emit('Status added', {test:'hello'});
    jobs.response(res, 200, {message:"Welcome"});
  });

  return api;
}
