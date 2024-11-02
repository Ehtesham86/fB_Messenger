"use client";
import React, { useEffect, useState,FormEvent } from "react";
import axios from 'axios';

// Define the types for your message structure
interface Recipient {
  recipient_name: string;
}

interface Message {
  id: number;
  text: string;
  created_at: string;
  recipient_id: number;
  recipients: Recipient;
}

interface ApiResponse {
  success: boolean;
  messages?: Message[];
  error?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
  const [message, setmessage] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);

  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);
  const [recipientId, setRecipientId] = useState<string>('8805839732787665'); // Default recipient ID

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [senderName, setSenderName] = useState<string>(''); // State for sender's name
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = async () => {
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/t_1724369945082697/messages?fields=message&access_token=EAAH20PSWGqEBOyzZByO64YZCGdtCPEjz7KEchsZBs3KpoX1D5pcBxiTXvwEZBPXaAwa8jvznkYrvGpEnOnrXUsN6ZAIb8byF2omZAmK0sAVQfKyCLvQFG7mYOEwK3AH8GlDyNMmKYxQdZCsPrZCwlA4SQ0qHY0UKCIshD6Jdgd3OIy1YXPfeJZCEWPQkDeZC2otGx23j3T4IZCHoDhXXT4HqZBE2DZCIZD`); // Call the GET API
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: ApiResponse = await res.json();
     console.log(data,'_____+')
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessage();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
            setmessage(''); // Clear the input after sending
            setSenderName(''); // Clear the sender name input
            fetchMessages(); // Refresh the message list after sending
        }
    } catch (error: any) {
        setError(error.message);
    }
};

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/sendMessage'); // Call the GET API
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: ApiResponse = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      } else {
        setError(data.error || "Failed to fetch messages");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    setRefresh(!refresh)
  }, []);

  // Update mobile view state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group messages by recipient ID
  const groupedMessages = messages.reduce((acc: Record<number, { recipient_name: string; messages: Message[] }>, message) => {
    const { recipient_id, recipients } = message;
    if (!acc[recipient_id]) {
      acc[recipient_id] = {
        recipient_name: recipients.recipient_name,
        messages: [],
      };
    }
    acc[recipient_id].messages.push(message);
    return acc;
  }, {});

  // Handle recipient selection
  const handleRecipientClick = (recipientId: number) => {
    setSelectedRecipientId(recipientId);
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (message.trim() && selectedRecipientId !== null) {
      const messageObj: Message = {
        id: messages.length + 1,
        text: message,
        created_at: new Date().toISOString(),
        recipient_id: selectedRecipientId,
        recipients: { recipient_name: groupedMessages[selectedRecipientId].recipient_name },
      };
      setMessages((prevMessages) => [...prevMessages, messageObj]);
      setmessage(""); // Clears input after sending
    }
  };

  // Render contacts list
  const renderContactsList = () => (
    <div className={`w-full ${!isMobileView ? 'md:w-1/3 lg:w-1/4' : ''} bg-gradient-to-t from-black to-slate-500 border-r p-4 overflow-y-auto`}>
      <h3 className="text-xl text-gray-300 font-serif font-bold mb-4">Contacts</h3>
      {Object.entries(groupedMessages).map(([recipientId, { recipient_name }]) => (
        <button
          key={recipientId}
          onClick={() =>{ handleRecipientClick(Number(recipientId))
            console.log(recipientId,'____')
            setSenderName(recipient_name)
          }}
          className={`p-3 w-full text-left rounded-lg flex items-center gap-2 mb-2 ${
            selectedRecipientId === Number(recipientId) ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <span className="font-semibold font-serif text-black">{recipient_name}</span>
        </button>
      ))}
    </div>
  );

  // Render chat messages
  const renderChatMessages = () => (
    <div className={`flex flex-col w-full ${!isMobileView ? 'md:w-2/3 lg:w-3/4' : ''}`}>
      {/* Chat header */}
      <div className="bg-gradient-to-l from-black to-slate-500 text-white p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {groupedMessages[selectedRecipientId!].recipient_name}
        </h3>
        <button
          onClick={() => setSelectedRecipientId(null)}
          className="text-white text-sm bg-gray-800 px-3 py-1 rounded-lg hover:bg-gray-600"
        >
          Back to Contacts
        </button>
      </div>

      {/* Message list */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        <ul className="space-y-3">
          {groupedMessages[selectedRecipientId!].messages.map((message) => (
            <li
              key={message.id}
              className={`p-3 rounded-lg shadow-md text-gray-800 max-w-xs ${
                message.recipient_id === selectedRecipientId ? "bg-blue-200 ml-auto text-right" : "bg-white mr-auto"
              }`}
            >
              {message.text}
            </li>
          ))}
        </ul>
      </div>
      {response && <div style={{ color: 'green' }}>Message sent successfully!</div>}

      {/* Chat input */}
      <div className="p-4 border-t bg-white flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-3 rounded-lg border focus:outline-none text-white bg-gradient-to-t from-black to-slate-500 focus:ring focus:ring-blue-200 mr-2"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600"
        >
          Send
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-200 text-gray-800">
      {(!isMobileView || selectedRecipientId === null) && renderContactsList()}
      {(!isMobileView || selectedRecipientId !== null) && selectedRecipientId !== null && renderChatMessages()}
      {isMobileView && selectedRecipientId === null && (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-gray-600">Select a contact to start chatting</p>
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default Chat;
