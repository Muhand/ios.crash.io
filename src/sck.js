const hat = require('hat');
var rack = hat.rack();

var currentSockets = [];
var currentRooms = {};
var soFarRoomNames = [];
var currentRoom;

module.exports = function(express, app){
  const io = require("socket.io")(express.server);
  io.listen(app.server);

  io.on('connection',function(socket){
    console.log("A user is connected");
    var roomName

    // console.log(`AND THE SOCKET IS `);
    // console.log(socket);
    // console.log(`--------------------`);
    currentSockets.push(socket);

    socket.on('download_rooms', function(name, currentUserName){
      socket.emit('available_rooms', currentRooms)
    });

    socket.on('new_room', function(data){
      if (!soFarRoomNames.includes(data.roomName)) {
        let newRoomID = rack()

        let newRoom = {
          id:newRoomID,
          name:data.roomName,
          members:[data.currentUser]
        }

        currentRooms[newRoomID] = newRoom

        soFarRoomNames.push(data.roomName)

        socket.join(data.roomName)
        roomName = data.roomName

        socket.emit('available_rooms', currentRooms)
        socket.emit('joined_room', data.roomName)
        socket.broadcast.emit('available_rooms', currentRooms)
      }
    });

    socket.on('join_room', (recievedRoomName) => {
      console.log(`RECIEVD ROOM NAME IS ${recievedRoomName}`);
      if (soFarRoomNames.includes(recievedRoomName)) {
        socket.join(recievedRoomName)
        socket.emit('joined_room', recievedRoomName)
        // socket.broadcast.emit('available_rooms', currentRooms)
        roomName =recievedRoomName
      }
    });

    socket.on('new_member', function(name){
      // currentSockets.forEach(user=>{
      //   if (user !== socket) {
          socket.broadcast.to(roomName).emit('new_member', `${name}`);
        // }
      // })
    });

    socket.on('member_leaving', function(name){
      // currentSockets.forEach(user=>{
      //   if (user !== socket) {
          socket.broadcast.to(roomName).emit('member_leaving', `${name}`);
        // }
      // })
    });

    socket.on('new_message', function(msg){
      console.log(`Recieved message ${msg}`);

      // currentSockets.forEach(user=>{
        // if (user !== socket) {
          socket.broadcast.to(roomName).emit('incoming_message', {name:msg.name, message:msg.message});
        // }
      // })
    });

    socket.on('new_image', function(imgData){
      // currentSockets.forEach(user=>{
        // if (user !== socket) {
          socket.broadcast.to(roomName).emit('new_image', imgData);
        // }
      // })
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
