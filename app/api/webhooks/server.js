import http from 'http';
import { Server } from 'socket.io';

// Create a server to listen for socket connections
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST"],
  },
});

// Handle incoming socket connections
io.on("connection", (socket) => {
  console.log("A user connected");
  
  // Emit a message to the client when new data arrives
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(4000, () => {
  console.log("Socket.io server running on port 4000");
});
