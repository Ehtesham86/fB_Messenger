import { io, Socket } from 'socket.io-client';

let socket: Socket; // Declare the socket variable

export const initializeSocket = () => {
  socket = io('http://localhost:3000'); // Replace with your server URL

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  return socket;
};
