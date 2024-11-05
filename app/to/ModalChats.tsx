"use client";

import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";

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

const ModalChats: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);
  const [userMessages, setUserMessages] = useState<Message[]>([]); // Store messages for the selected user
  const [users, setUsers] = useState<User[]>([]); // Store user list

  // Fetch chat data from the API
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetch("https://graph.facebook.com/v21.0/t_1724369945082697/messages?fields=message,created_time,from,to&access_token=EAAH20PSWGqEBO4ofnp0hgYggpkLdHEkQy8UvZATbfA1fhs1VNoX2y8pvZACEvcw6XhDPR8peVlHeqCpi92SOahChM0bY0RAvqggRG6XL266nahszr2527HIGBcF57kTbAUoTctwqZBFBTNZCRa2SOxQeUYU3MHLGvmidW39vani4uMrClwflQyCL8y1ZC81kHZArgHMA4dVOZAyNZAFZBsWoItNQZD"); // Replace with your actual API endpoint
        const data = await response.json();
        setUserMessages(data.data); // Assuming data.data contains the messages
        // Create a unique user list from the messages
        const uniqueUsers = Array.from(
          new Set(data.data.flatMap((msg: Message) => [
            { id: msg.from.id, name: msg.from.name, email: msg.from.email },
            ...msg.to.data.map(user => ({ id: user.id, name: user.name, email: user.email }))
          ]))
        );
        setUsers(uniqueUsers);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatData();
  }, []);

  // Fetch messages for the selected user
  const handleRecipientClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const renderContactsList = () => {
    // Create a unique list of users based on their IDs
    const uniqueUsers = Array.from(
      new Set(
        userMessages.flatMap((msg) => [
          msg.from.id,
          ...msg.to.data.map(user => user.id)
        ])
      )
    ).map(userId => users.find(user => user.id === userId)); // Find user objects by ID
  
    return (
      <div className={`h-full ${!isMobileView ? 'md:w-1/3 lg:w-1/4' : ''} rounded bg-gradient-to-t from-black to-slate-500 border-r p-4`}>
        <h3 className="text-xl text-gray-300 font-serif font-bold mb-4">Contacts</h3>
        <div className="overflow-y-auto  h-[600px]"> {/* Fixed height for contact list with scroll if needed */}
          {uniqueUsers.map((user) => (
            <button
              key={user?.id}
              onClick={() => handleRecipientClick(user!.id)}
              className={`w-full p-2 text-left rounded-lg flex items-center gap-2 mb-2 ${selectedUserId === user?.id ? "bg-blue-100" : "hover:bg-gray-500"}`}
            >
              <span className="font-semibold font-serif text-black">{user?.name}</span>
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
        <div className="max-h-[550px] overflow-y-auto p-4"> {/* Set fixed height for messages list */}
          {userMessages.length ? (
            <ul className="space-y-3">
              {userMessages
                .filter(msg => msg.from.id === selectedUserId || msg.to.data.some(user => user.id === selectedUserId))
                .map((msg) => (
                  <li
                    key={msg.id}
                    className={`p-3 rounded-lg shadow-md text-gray-800 max-w-xs ${msg.from.id === selectedUserId ? "bg-blue-200 ml-auto text-right" : "bg-white mr-auto"}`}
                  >
                    <div>{msg.message}</div>
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
          onClick={() => {
            setMessage(""); // Clear input on "send" click
            // Here you could add a function to send the message to the server
          }}
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
