//Import modules
const { Router } = require('express');

//Export router
module.exports = ({jobs}) => {
  let api = Router();

  // '/'
  api.get('/', (req, res) => {
    jobs.response(res, 200, {message:"Welcome"});
  });

  return api;
}
