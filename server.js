const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

const io = socketIO(server, {
    cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }}
  );

app.use(cors());

let adminSocketId = null;

io.on('connection', (socket)=>{
    console.log('user connected');

      if (!adminSocketId) {
      adminSocketId = socket.id;
      console.log(socket.id)
      console.log(adminSocketId)
      io.to(adminSocketId).emit('adminStatus', true);
      console.log("admin")// Emit admin status only to the first connected socket
    } else {
      io.to(socket.id).emit('adminStatus', false); 
      console.log("user")// Emit regular user status to subsequent connected sockets
    }

    socket.on('initial-ball', ({x,y})=>{
      io.emit("initial-position", ({x,y}))
    })

    socket.on('admin-move-ball', (wallIndex)=>{
          io.emit('move-ball', wallIndex);
    })

    socket.on('disconnect', ()=>{
        console.log('user is disconnected');
        if (socket.id === adminSocketId) {
          adminSocketId = null; // Reset adminSocketId if the admin disconnects
      }
       
    })
})

server.listen(PORT, ()=>{
 console.log("server is running on port", PORT);
})