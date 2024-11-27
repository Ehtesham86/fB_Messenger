"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
let socket: Socket; // Declare the socket variable

import { initializeSocket } from '../socketService/socketService'; // Import the initialization function

const RealTimeChat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<{ message: string; created_at: string }[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [senderId, setSenderId] = useState<string>('08710c56-5de1-4452-b7af-4f06bfcb2096');
  const [receiverId, setReceiverId] = useState<string>('3');
  const [isModalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState<any[]>(["this is 1 text"]);


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
      // Handle socket message
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/receive-message`, {
          id: senderId,
          message,
        });

        if (response.status !== 200) {
          throw new Error('Failed to send message to the server');
        }

        setMessage(''); // Clear the input after sending
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
      alert("clear")
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value.split("\n"); // Split input by line breaks and update the array
    setText(newText);
  };

  const handleClear = () => {
    setText([]); // Clears the text array
  };

  const handleGenerate = () => {
    setText((prevText) => {
      // Get the last added text, or use a default if no text has been added yet
      const lastAddedText = prevText.length > 0 ? prevText[prevText.length - 1] : "default text";
      
      // Append the last added text to the array
       return [...prevText, text];
      
    });
  };
  const handleCopy = () => {
    const textToCopy = text.map((item) => item).join("\n");
    
    // Use the clipboard API to copy the text to clipboard
    navigator.clipboard.writeText(textToCopy).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chat Application</h1>

      {/* First child: Form + buttons */}
      <div style={styles.formAndButtons}>
        
        <div className="text ">
          <form>
            <div className="w-[20%] h-auto mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <textarea
                  id="comment"
                  className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Write a comment..."
                  value={text.map((item) => item).join("\n")}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-start mt-2">
          <button onClick={handleGenerate} className='bg-red-600 p-2 rounded-xl  '>Gen</button>
          <button onClick={handleClear} className='bg-green-600 p-2 rounded-xl ml-2 ' >Clear</button>
          <button onClick={handleCopy} className='bg-blue-700 p-2 text-white rounded-xl ml-2  ' >Copy</button>
        </div>
      </div>

      {/* Modal Toggle Button */}
      <div className="flex flex-row items-center justify-end p-4 h-screen">
        <button
          onClick={toggleModal}
          style={styles.chatButton}
        >
          Chat
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div id="simple-modal" aria-hidden="true" className="fixed  top-0 right-0 z-50 w-full md:w-[50%] h-full overflow-y-auto">
            <div className="relative p-4 w-full h-full max-h-full">
              <div className="relative bg-white rounded-lg shadow  dark:bg-gray-700 h-full">
                <button
                  type="button"
                  className="ml-[50%]   text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={toggleModal}
                >
                  <span className="sr-only">Close modal</span>
                  &times;
                </button>
                <div style={styles.sidebar} className='p-8'>
                  <h2 style={{ color: 'black' }}>Users</h2>
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
                    <button onClick={sendMessage} style={styles.sendButton}>Send Message</button>
                  </div>

                  <div style={styles.receivedMessages}>
                    {receivedMessages.map((msg, index) => (
                      <div key={index} style={styles.messageContainer}>
                        <p style={styles.messageText}>{msg.message}</p>
                        <p style={styles.createdAtText}>
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', flexDirection: 'column', padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { textAlign: 'center', marginBottom: '20px' },
  formAndButtons: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', flex: 1 },
  button: { backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  chatButton: { marginTop: '20px', backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' },
  sidebar: { padding: '10px' },
  list: { listStyleType: 'none', padding: '0' },
  listItem: { padding: '10px', cursor: 'pointer' },
  receivedMessages: { marginTop: '20px', overflowY: 'auto', height: '700px', width: '100%' },
  messageContainer: { marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
  messageText: { fontSize: '16px', wordWrap: 'break-word', marginBottom: '0.5rem', color: 'black' },
  createdAtText: { fontSize: '12px', color: '#888' },
  sendButton: { backgroundColor: '#007BFF', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default RealTimeChat;
