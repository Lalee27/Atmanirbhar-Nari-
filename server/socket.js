const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3001',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);

    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room ${userId}`);
      }
    });

    socket.on('leave', (userId) => {
      if (userId) {
        socket.leave(userId);
        console.log(`Socket ${socket.id} left room ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from socket:', socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
