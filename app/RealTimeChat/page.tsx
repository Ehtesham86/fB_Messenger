// Import necessary modules and hooks
"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';


// import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
let socket: Socket; // Declare the socket variable

import { initializeSocket } from '../socketService/socketService';  // Import the initialization function
import { useRouter } from 'next/navigation';

const RealTimeChat: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<{ message: string; created_at: string }[]>([]);
  console.log(receivedMessages,'receivedMessages________')
  const [users, setUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [senderId, setSenderId] = useState<string>('08710c56-5de1-4452-b7af-4f06bfcb2096');
  const [receiverId, setReceiverId] = useState<string>('3');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          console.log(session,'session_____')
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    fetchSession();
  }, [supabase]);
  const toggleModal = () => {
      setModalOpen(!isModalOpen);
  };
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/receive-message?id=08710c56-5de1-4452-b7af-4f06bfcb2096`
        );
        setReceivedMessages(data.messages); // Access the "messages" array from the response
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);
  useEffect(() => {
    const socket = initializeSocket();

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/users`);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    socket = io('http://localhost:8000');
    socket.on('message', (msg: { sender: string; content: string }) => {
      // setReceivedMessages(prevMessages => [...prevMessages, { senderId: msg.sender, content: msg.content, from: 'user' }]);
    });

    fetchUsers();
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim() && senderId && receiverId) {
      if (!socket) {
        console.error('Socket is not initialized');
        return;
      }

      // Emit the message through the socket
      socket.emit('message', {
        content: message,
        sender: senderId,
        receiver: receiverId,
        from: 'admin',
      });

      try {
        // Call the API with the payload
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/receive-message`, {
          id: senderId,
          message,
        });

        if (response.status !== 200) {
          throw new Error('Failed to send message to the server');
        }

        // Clear the message input after sending
        setMessage('');
      } catch (error) {
        console.error('Error sending message to the server:', error);
      }
    } else {
      alert('Message content and sender/receiver IDs are required.');
    }
  };
  

  const fetchChats = async (userId: string) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/chats/${userId}`);
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/messages/${chatId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div style={styles.container}>  
      <h1 style={styles.title}>Chat Application</h1>
      <div className="flex flex-col items-center justify-center h-screen">
            {/* Modal toggle button */}
            <button
                onClick={toggleModal}
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                Chat
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div
                    id="simple-modal"
                    aria-hidden="true"
                    className="fixed top-0 right-0 z-50 w-full md:w-1/3 h-full overflow-y-auto"
                >

                    <div className="relative p-4 w-full h-full max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 h-full">
                            {/* Close button positioned absolutely at the top right */}
                            <button
                                type="button"
                                className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={toggleModal}
                            >
                                <span className="sr-only">Close modal</span>
                                &times; {/* Simple close icon */}
                            </button>
                            <div style={styles.sidebar}>
        <h2 style={{color:'black'}}>Users</h2>
        <ul style={styles.list}>
          {users.map((user) => (
            <li key={user.id} style={styles.listItem} onClick={() => fetchChats(user.id)}>
              {user.full_name}
            </li>
          ))}
        </ul>
      </div>

                            <div className="p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h2 className="text-xl text-gray-900 dark:text-white">Messages in Chat</h2>
                                <div className="flex items-center mt-4">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="border rounded-lg p-2 w-full text-black"
                                    />
                                    <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white rounded-lg text-sm px-2 py-0 ">Send Message</button>
                                </div>
                                
                                <div style={styles.receivedMessages}>
      {receivedMessages.map((msg, index) => (
        <div key={index} style={styles.messageContainer}>
          <p style={styles.messageText}>{msg.message}</p>
          <p style={styles.createdAtText}>{new Date(msg.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

      <div style={styles.mainContent}>
        <div>
          <h2>Chats</h2>
          <ul style={styles.list}>
            {chats.map((chat) => (
              <li key={chat.id} style={styles.listItem} onClick={() => fetchMessages(chat.id)}>
                Chat ID: {chat.id}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Messages in Chat</h2>
          <ul style={styles.messageList}>
            {messages.map((msg) => (
              <li key={msg.id} style={msg.sender === senderId ? styles.sentMessage : styles.receivedMessage}>
                <span>{msg.content}</span>
              </li>
            ))}
          </ul>
        </div>

    

      </div>
    </div>
  );
};

export default RealTimeChat;

// Styling using JavaScript
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', flexDirection: 'column', padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { textAlign: 'center' as 'center', marginBottom: '20px' },
  sidebar: { flex: '1', padding: '10px', borderRight: '1px solid #ccc',color:'red' },
  mainContent: { flex: '3', padding: '20px' },
  list: { listStyleType: 'none', padding: '0' },
  listItem: { padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' },
  messageList: { listStyleType: 'none', padding: '0' },
  inputContainer: { display: 'flex', alignItems: 'center', marginTop: '10px' },
  input: { padding: '10px', marginRight: '10px', flex: '1', borderRadius: '4px', border: '1px solid #ccc', color: 'black' },
  sendButton: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  receivedMessages: { marginTop: '20px' },
  adminMessage: { color: 'gray' },
  userMessage: { color: 'black' },
  sentMessage: { backgroundColor: '#007bff', color: '#fff', padding: '8px', borderRadius: '5px', textAlign: 'right', marginBottom: '5px', alignSelf: 'flex-end', maxWidth: '70%' },
  receivedMessage: { backgroundColor: '#f1f1f1', color: '#000', padding: '8px', borderRadius: '5px', textAlign: 'left', marginBottom: '5px', alignSelf: 'flex-start', maxWidth: '70%' },
  
  messageContainer: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  messageText: {
    fontSize: '16px',
    marginBottom: '0.5rem',
    color:'black'
  },
  createdAtText: {
    fontSize: '12px',
    color: '#888',
  },


};
