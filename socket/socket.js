import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://chat-wavefrontend.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Mapping to keep track of user connections
const userSocketMap = {};

// Utility function to get a user's socket ID
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// Socket.IO connection event
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Store user's socket ID
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
    
    // Emit the updated list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Listen for disconnect event
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);
      
      // Emit the updated list of online users to all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// Exports
export { app, io, server };
