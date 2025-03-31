const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', socket.id);
    
    // Send current users in the room
    const roomUsers = io.sockets.adapter.rooms.get(roomId);
    if (roomUsers) {
      const users = Array.from(roomUsers);
      io.to(roomId).emit('room-users', users);
    }
  });
  
  // Handle note updates
  socket.on('note-update', (data) => {
    const { roomId, content } = data;
    // Broadcast update to everyone in the room except sender
    socket.to(roomId).emit('note-updated', content);
  });
  
  // Handle cursor position
  socket.on('cursor-move', (data) => {
    const { roomId, position, userId } = data;
    socket.to(roomId).emit('cursor-moved', { position, userId });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    io.emit('user-left', socket.id);
  });
});

// API routes
const noteRoutes = require('./routes/notes');
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));