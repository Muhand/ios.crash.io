//Import Modules
const http = require('http');
// const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const routes =  require('./routes');
const jobs = require('./jobs');
// const io = require("socket.io")(express.server);
const sck = require('./sck');
const models = require('./models/index');
const fs = require('fs');

//Certificates
var key = fs.readFileSync('encryption/private.key');
var cert = fs.readFileSync( 'encryption/sockets.io.crt' );
var ca = fs.readFileSync( 'encryption/intermediate.crt' );

var options = {
  key: key,
  cert: cert,
  ca: ca
};


//Global variables
var initialized = false;

//Private methods
function _errorsHandeling()
{
  //Handle memory leaks
  process.on('warning', function(w){
    console.log('-------------------------------------------------------------');
    console.log(' => MEMORY LEAK WARNING - PRINTING STACK => ', w.stack || w);
    console.log('-------------------------------------------------------------');
  });

  //Catch other errors

}

module.exports = class Boot {
  static init() {
    //Enable error handeling
    _errorsHandeling();

    //Initialize some variables
    let errors = [];

    //Return a promise
    return new Promise(
      (resolve, reject) => {

        //Was the app already initialized?
        if (initialized) {
          //If yes then through an error back
          errors.push(new Error("This app was already initialized."));

          reject(errors);
        } //Otherwise just continue with the app normally

        //Initialize the server
        let app = express();
        app.server = http.createServer(app);

        // Configure bodyParser
        // - Important to allow us to grab the body of POST
        app.use(bodyParser.urlencoded({
          extended: true
        }));

        app.use(bodyParser.json({
          //Limit how many byes we can recieve to avoide any unwanted requests
          limit: '100kb'
        }));

        //Prefix routes with the api version extension
        app.use(routes);

        // catch 401 and forward to error handler
        // app.use( (req, res) => {
        //   jobs.response(res, 401, {error:"Forbidden"});
        // });


        //Setup the server port
        var port = process.env.PORT || 3000;

        //Are there any errors?
        if (errors.length > 0) {
          //If yes then reject
          reject(errors);
        }
        sck(express, app)
        // io.listen(app.server);
        //
        // io.on('connection',function(socket){
        //   console.log("A user is connected");
        //   socket.on('status added',function(status){
        //     add_status(status,function(res){
        //       if(res){
        //         io.emit('refresh feed',status);
        //       } else {
        //         io.emit('error');
        //       }
        //     });
        //   });
        //
        //   socket.on('new_message', function(msg){
        //     console.log(`Recieved message ${msg}`);
        //     socket.emit('incoming_message', `${msg}`);
        //   });
        //
        //   socket.on('disconnect',function(status){
        //     console.log(`A user is disconnected`);
        //   });
        // });

        var add_status = function (status,callback) {
          var new_status = new models.Status();
          new_status.s_text = status;

          new_status.save(err=>{
            if (err) {
              return callback(false);
            } else {
              return callback(true);
            }
          });
        }

        //Otherwise try to start the server
        app.server.listen(port, err => {
          //Was there an error starting the server?
          if (err) {
            //If yes then add the error and reject
            errors.push(new Error(err));
            reject(errors);
          } else {
            // io.listen(app.server);
            //
            // io.on('connection',function(socket){
            //   console.log("A user is connected");
            //   // socket.on('status added',function(status){
            //   //   add_status(status,function(res){
            //   //     if(res){
            //   //       io.emit('refresh feed',status);
            //   //     } else {
            //   //       io.emit('error');
            //   //     }
            //   //   });
            //   // });
            // });


            resolve(app);
          }
        });

      }
    ); // End of promise

  } // End of init

} // End of class
