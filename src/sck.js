var currentSockets = [];
var currentRooms = {}

module.exports = function(express, app){
  const io = require("socket.io")(express.server);
  io.listen(app.server);

  io.on('connection',function(socket){
    console.log("A user is connected");
    // console.log(`AND THE SOCKET IS `);
    // console.log(socket);
    // console.log(`--------------------`);
    currentSockets.push(socket);

    socket.on('new_room', function(name){

    });

    socket.on('new_member', function(name){
      currentSockets.forEach(user=>{
        if (user !== socket) {
          user.emit('new_member', `${name}`);
        }
      })
    });

    socket.on('member_leaving', function(name){
      currentSockets.forEach(user=>{
        if (user !== socket) {
          user.emit('member_leaving', `${name}`);
        }
      })
    });

    socket.on('new_message', function(msg){
      console.log(`Recieved message ${msg}`);

      currentSockets.forEach(user=>{
        if (user !== socket) {
          user.emit('incoming_message', {name:msg.name, message:msg.message});
        }
      })
    });

    socket.on('new_image', function(imgData){
      currentSockets.forEach(user=>{
        if (user !== socket) {
          user.emit('new_image', imgData);
        }
      })
    });

    socket.on('disconnect',function(socket){
      var index = currentSockets.indexOf(socket);
      if (index > -1) {
        currentSockets.splice(index, 1);
        console.log(`Socket deleted`);
      }

      console.log(`A user is disconnected`);
    });

  });
}
