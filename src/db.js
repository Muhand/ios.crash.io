const mongoose = require('mongoose');

const initialize = () =>
  new Promise(
    (resolve, reject) => {
      mongoose.Promise = global.Promise;

      // let dbURL = `${config.db.provider}://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;
      let dbURL = "mongodb://test:test@ds249818.mlab.com:49818/nodejs-sockets";

      const options = {
        //Refer to http://mongoosejs.com/docs/connections.html#use-mongo-client for more info on options
        poolSize: 100
      }

      mongoose.connect(dbURL, options)
        .then(
          ()=>{
            resolve();
          },
          err=>{
            reject(new Error(err));
            // throw err;
          }
        );
      }
    );

module.exports = initialize;
