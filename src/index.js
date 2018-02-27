const boot = require('./boot');



boot.init()
  .then(
    app => {
      console.log(`Server started on port: ${app.server.address().port}`);
    }
  )
  .catch(
    errors => {
      console.log("The server failed to boot because of the following: \n");

      //Loop through each error
      errors.forEach(err=>{
        console.log(`      - ${err}`);
      });

      throw(errors);
    }
  )
