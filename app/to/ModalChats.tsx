"use client";

import React, { useEffect, useState,FormEvent, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Socket.io server URL
interface User {
  id: string; // Use string for user IDs as per your API response
  name: string;
  email: string;
}

interface Message {
  id: string;
  message: string;
  created_time: string;
  from: User;
  to: { data: User[] };
}
interface ApiResponse {
  success: boolean;
  data?: any; // You can specify the type based on your response structure
  error?: any; // You can specify the type based on your error structure
  messages?: any; // You can specify the type based on your error structure

}
const ModalChats: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);
  const [userMessages, setUserMessages] = useState<Message[]>([]); // Store messages for the selected user
  console.log(userMessages,'________')
  const [users, setUsers] = useState<User[]>([]); // Store user list
  const [error, setError] = useState<string | null>(null);
   const [newMessage, setNewMessage] = useState<string>("");
     const [recipientId, setRecipientId] = useState<string >('');
    const [senderName, setSenderName] = useState<string>(""); // State for sender's name
    const [refresh, setRefresh] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => { if (bottomRef.current) { bottomRef.current.scrollIntoView({ behavior: 'smooth' }); } };

    const [response, setResponse] = useState<ApiResponse | null>(null);

  
    // Set initial messages state with the provided data
  const [messages, setMessages] = useState<Message[]>([]);
  console.log(messages,'____messages')
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    // Listen for new messages and update state
    socket.on("new_message", (newMessage) => {
      console.log("New message received:", newMessage);
      setUserMessages((prevMessages) => [...prevMessages, newMessage]);

      // Extract unique users from the new message
      const uniqueUsers: User[] = Array.from(
        new Set(
          newMessage.flatMap((msg: { from: User; to: { data: User[] } }) => [
            { id: msg.from.id, name: msg.from.name, email: msg.from.email },
            ...msg.to.data.map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
            })),
          ])
        )
      ) as User[];
      scrollToBottom();

      setUsers(uniqueUsers);
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    scrollToBottom();
    setResponse(null);
    setError(null);

    try {
        const res = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, recipientId, senderName }), // Include sender name in the request
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: ApiResponse = await res.json();
        setResponse(data);

        if (data.success) {
        scrollToBottom();

            setMessage(""); // Clear the input after sending
             fetchMessages(); // Refresh the message list after sending
        }
    } catch (error: any) {
        setError(error.message);
    }
};
  const fetchMessages = async () => {
    scrollToBottom();

    try {
        const res = await fetch('/api/sendMessage'); // Call the GET API
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: ApiResponse = await res.json();
        if (data.success) {
            setMessages(data.messages);
            
            setRefresh(!refresh)
        } else {
            setError(data.error);
        }
    } catch (error: any) {
        setError(error.message);
    }
};

useEffect(() => {
  fetchMessages(); // Fetch messages when component mounts
}, []);
const sendMessage = () => {
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  recipient: {
    id: "8805839732787665",
  },
  messaging_type: "RESPONSE",
  message: {
    text: "Hello, World!",
  },
  access_token: "EAAH20PSWGqEBO2RGqggBP2XhFwDkqUnE76bpvhzl40NAr1Op7QlBR8RIAzzvdAPtz9hbhCg4cEYaSIxUfjh8NJh2vzDoSuWvYns8NpHguuX6XjkC9h73RoLV3gRhk4cOTT9nLZAVS1Yetp9AslbinzgFyXHXt6XmMqhAZB1TdHgYcse5Ul0Bww5zR1fGDGTj8uZCxL8yMfr6EUoxCkxzaUP",
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("https://graph.facebook.com/v13.0/110689178427068/messages?access_token=EAAH20PSWGqEBO2RGqggBP2XhFwDkqUnE76bpvhzl40NAr1Op7QlBR8RIAzzvdAPtz9hbhCg4cEYaSIxUfjh8NJh2vzDoSuWvYns8NpHguuX6XjkC9h73RoLV3gRhk4cOTT9nLZAVS1Yetp9AslbinzgFyXHXt6XmMqhAZB1TdHgYcse5Ul0Bww5zR1fGDGTj8uZCxL8yMfr6EUoxCkxzaUP", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error("Error:", error));
};

 
useEffect(() => {
  scrollToBottom();

    fetchMessages(); // Fetch messages when component mounts

}, []);
  // Fetch chat data from the API
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetch("https://graph.facebook.com/v21.0/t_1724369945082697/messages?fields=message,created_time,from,to&access_token=EAAH20PSWGqEBO2RGqggBP2XhFwDkqUnE76bpvhzl40NAr1Op7QlBR8RIAzzvdAPtz9hbhCg4cEYaSIxUfjh8NJh2vzDoSuWvYns8NpHguuX6XjkC9h73RoLV3gRhk4cOTT9nLZAVS1Yetp9AslbinzgFyXHXt6XmMqhAZB1TdHgYcse5Ul0Bww5zR1fGDGTj8uZCxL8yMfr6EUoxCkxzaUP");
        const data = await response.json();

        setUserMessages(data.data); // Assuming data.data contains the messages
console.log(data,'_______data')

        // Create a unique user list from the messages
        const uniqueUsers: User[] = Array.from(
          new Set<User>(
            data?.data?.flatMap((msg: Message) => [
              { id: msg.from.id, name: msg.from.name, email: msg.from.email },
              ...msg.to.data.map(user => ({ id: user.id, name: user.name, email: user.email }))
            ])
          )
        );

        setUsers(uniqueUsers); // This should now work correctly

        console.log(uniqueUsers, '__________uniqueUsers');
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatData();
  }, [refresh]);

  // Fetch messages for the selected user
  const handleRecipientClick = (userId: string) => {
    setSelectedUserId(userId);
  };
  const renderContactsList = () => {
    // Create a unique list of users based on their IDs, filtering out undefined values
    scrollToBottom();
    const uniqueUsers = Array.from(
      
      new Set(
        userMessages?.flatMap((msg) => [
          msg.from.id,
          ...msg.to.data.map(user => user.id)
        ])
      )
    )
    .map(userId => users.find(user => user.id === userId))
    .filter((user): user is { id: string; name: string; email: string } => user !== undefined); // Filter out undefined values
  
    return (
      <div className={`h-full ${!isMobileView ? 'md:w-1/3 lg:w-1/4' : ''} rounded bg-gradient-to-t from-black to-slate-500 border-r p-4`}>
        <h3 className="text-xl text-gray-300 font-serif font-bold mb-4">Contacts</h3>
        <div className="overflow-y-auto h-[600px]"> {/* Fixed height for contact list with scroll if needed */}
          {uniqueUsers.filter(user => user.name.toLowerCase() !== "abc").map((user) => (
            <button
              key={user.id}
              onClick={() => {
                handleRecipientClick(user.id);
                setRecipientId(user.id);
                setSenderName(user.name);
                scrollToBottom();
              
                console.log(user, '______________');
              }}
              className={`w-full p-2 text-left rounded-lg flex items-center gap-2 mb-2 ${
                selectedUserId === user.id ? "bg-blue-100" : "hover:bg-gray-500"
              }`}
            >
              <span className="font-semibold font-serif text-black">{user.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
};


  const renderChatMessages = () => (
    <div className={`flex flex-col w-full ${!isMobileView ? 'md:w-2/3 lg:w-3/4' : ''}`}>
      <div className="bg-gradient-to-l from-black to-slate-500 text-white p-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {users.find((user) => user.id === selectedUserId)?.name || "No Recipient Selected"}
        </h3>
        <button
          onClick={() => setSelectedUserId(null)}
          className="text-white text-sm bg-gray-800 px-3 py-1 rounded-lg hover:bg-gray-600"
        >
          Back to Contacts
        </button>
      </div>

      <div className="flex-grow overflow-y-auto bg-gray-50">
        <div className="max-h-[550px] overflow-y-auto p-4" > {/* Set fixed height for messages list */}
        {userMessages.length ? (
  <ul className="space-y-3" >
    {userMessages
      .filter(msg => msg.from.id === selectedUserId || msg.to.data.some(user => user.id === selectedUserId))
      .sort((a, b) => new Date(a.created_time).getTime() - new Date(b.created_time).getTime()) // Sort by created_time in ascending order
      .map((msg) => (
        <li
       
          key={msg.id}
          className={`p-3 rounded-lg shadow-md text-gray-800 max-w-xs ${msg.from.id === selectedUserId ? "bg-blue-200 ml-auto text-right" : "bg-white mr-auto"}`}
        >
          <div ref={bottomRef} >{msg.message}</div>
          <div className="text-xs text-gray-500">{new Date(msg.created_time).toLocaleString()}</div>
        </li>
      ))}
  </ul>
) : (
  <p className="text-center text-gray-600">No messages with this user.</p>
)}

        </div>
      </div>

      <div className="p-3 border-t bg-white flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-2 rounded-lg border focus:outline-none bg-gray-100 focus:ring focus:ring-blue-200 mr-2"
        />
        <button
             onClick={ handleSubmit }
               
 
               
                
          className="px-4 py-2 items-center flex gap-2 bg-gray-800 text-white rounded-lg hover:bg-gradient-to-r from-gray-700 via-black to-white"
        >
          <IoIosSend size={20} /> <p>Send</p>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-200 text-gray-800">
      {(!isMobileView || selectedUserId === null) && renderContactsList()}
      {(!isMobileView || selectedUserId !== null) && selectedUserId !== null && renderChatMessages()}
      {isMobileView && selectedUserId === null && (
        <div className="flex items-center justify-center h-full w-full">
          <p className="hidden md:text-gray-600">Please select a chat. Your messages will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ModalChats;
