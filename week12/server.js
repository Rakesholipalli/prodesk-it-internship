const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const roomUsers = {};
const typingStatus = {};

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('user-joined', ({ username }) => {
    socket.username = username;
    console.log(`👤 User ${username} (${socket.id}) joined`);
  });

  socket.on('join-room', ({ room, username }) => {
    socket.join(room);
    socket.currentRoom = room;
    socket.username = username;

    if (!roomUsers[room]) {
      roomUsers[room] = [];
    }
    
    roomUsers[room] = roomUsers[room].filter(user => user.id !== socket.id);
    roomUsers[room].push({ id: socket.id, username });

    console.log(`🚪 ${username} joined room: ${room}`);

    socket.to(room).emit('user-joined-room', {
      username,
      message: `${username} has joined the ${room} room`,
      timestamp: new Date().toISOString()
    });

    io.to(socket.id).emit('room-users', roomUsers[room]);
    socket.emit('room-joined', { room, username });
  });

  socket.on('send-message', ({ room, message, username }) => {
    const payload = {
      username,
      message,
      timestamp: new Date().toISOString(),
      room
    };

    console.log(`💬 [${room}] ${username}: ${message}`);
    io.to(room).emit('receive-message', payload);
  });

  socket.on('typing', ({ room, username, isTyping }) => {
    const typingKey = `${room}-${socket.id}`;
    
    if (isTyping) {
      typingStatus[typingKey] = username;
    } else {
      delete typingStatus[typingKey];
    }

    console.log(`⌨️ ${username} typing=${isTyping} in ${room}`);
    socket.to(room).emit('user-typing', { username, isTyping });
  });

  socket.on('leave-room', ({ room, username }) => {
    console.log(`🚪 ${username} leaving ${room}`);
    
    socket.to(room).emit('user-left-room', {
      username,
      message: `${username} has left the ${room} room`,
      timestamp: new Date().toISOString()
    });

    socket.leave(room);
    
    if (roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter(user => user.id !== socket.id);
    }

    delete typingStatus[`${room}-${socket.id}`];
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);

    Object.keys(roomUsers).forEach(room => {
      if (roomUsers[room]) {
        const user = roomUsers[room].find(u => u.id === socket.id);
        if (user) {
          roomUsers[room] = roomUsers[room].filter(u => u.id !== socket.id);
          
          socket.to(room).emit('user-left-room', {
            username: user.username,
            message: `${user.username} has disconnected`,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    Object.keys(typingStatus).forEach(key => {
      if (key.includes(socket.id)) {
        delete typingStatus[key];
      }
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`📱 Network: http://[YOUR_IP]:${PORT}`);
});
