"use client"
import { useEffect } from 'react';
import { initializeSocket } from './socketService'; // Import the socket initialization

const SocketPage = () => {
  useEffect(() => {
    const socket = initializeSocket(); // Initialize the socket when the component mounts

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, []);

  return (
    <div>
      <h1>Socket Service Page</h1>
      <p>The socket connection is established and ready for communication.</p>
    </div>
  );
};

export default SocketPage;
