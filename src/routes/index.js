const express = require('express');
const jobs = require('../jobs/index');
const initializeDb = require('../db');
const controllersRouter = require('../controllers/index');

let router = express();

//Connect to the db
initializeDb()
  .then(
    ()=>{
      console.log(`Connection to the database was successful`);

      //'/'
      router.use('/', controllersRouter.Home({jobs}));

      //'/chat'
      router.use('/chat', controllersRouter.Chat({jobs}));

    }
  )
  .catch(
    err=>{
      console.log(`Connection to the database failed because ${err}`);
    }
  )

module.exports = router;
