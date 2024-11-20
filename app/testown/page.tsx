"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Define the event names for communication between client and server
interface ServerToClientEvents {
  "message-from-nextjs": (data: { response: string }) => void; // Server to client event
}

interface ClientToServerEvents {
  "message-from-html": (data: { text: string }) => void; // Client to server event
}

let socket: Socket<ClientToServerEvents, ServerToClientEvents>;

const Testown: React.FC = () => {
  useEffect(() => {
    // Initialize the socket connection
    socket = io("api/messagestest");

    // Listen for messages from the HTML file (client to server event)
    socket.on("message-from-html", (data) => {
      console.log("Received message from HTML:", data);

      // Send a response back to the HTML file (server to client event)
      socket.emit("message-from-nextjs", { response: "Hello from Next.js!" });
    });

    // Clean up on component unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Next.js App with Socket.io Communication</h1>
    </div>
  );
};

export default Testown;
