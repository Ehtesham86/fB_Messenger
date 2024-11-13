"use client";
import React, { useState, useEffect,FormEvent } from "react";
import { IoIosSend } from "react-icons/io";

interface Message {
  id: number;
  text: string;
  created_at: string;
  recipient_id: number;
  message_id: string | null;
  fb_message_id: string;
  fb_recipient_id: string;
  recipient_name: string | null;
  recipients: {
    id: number;
    recipient_name: string;
    facebook_id: string;

  };
}
interface ApiResponse {
  success: boolean;
  data?: any; // You can specify the type based on your response structure
  error?: any; // You can specify the type based on your error structure
  messages?: any; // You can specify the type based on your error structure

}

const ModalChats: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);
    const [message, setMessage] = useState<string>('');
    const [recipientId, setRecipientId] = useState<string | undefined>(undefined);
    const [senderName, setSenderName] = useState<string>(''); // State for sender's name

    const [response, setResponse] = useState<ApiResponse | null>(null);
    // Set initial messages state with the provided data
  const [messages, setMessages] = useState<Message[]>([]);
  console.log(messages,'____messages')
  const fetchMessages = async () => {
    try {
        const res = await fetch('/api/sendMessage'); // Call the GET API
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: ApiResponse = await res.json();
        if (data.success) {
            setMessages(data.messages);
            
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
    access_token: "EAAH20PSWGqEBO4ofnp0hgYggpkLdHEkQy8UvZATbfA1fhs1VNoX2y8pvZACEvcw6XhDPR8peVlHeqCpi92SOahChM0bY0RAvqggRG6XL266nahszr2527HIGBcF57kTbAUoTctwqZBFBTNZCRa2SOxQeUYU3MHLGvmidW39vani4uMrClwflQyCL8y1ZC81kHZArgHMA4dVOZAyNZAFZBsWoItNQZD",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect, // Fix: Cast to the correct type
  };

  fetch("https://graph.facebook.com/v13.0/110689178427068/messages?access_token=EAAH20PSWGqEBO4ofnp0hgYggpkLdHEkQy8UvZATbfA1fhs1VNoX2y8pvZACEvcw6XhDPR8peVlHeqCpi92SOahChM0bY0RAvqggRG6XL266nahszr2527HIGBcF57kTbAUoTctwqZBFBTNZCRa2SOxQeUYU3MHLGvmidW39vani4uMrClwflQyCL8y1ZC81kHZArgHMA4dVOZAyNZAFZBsWoItNQZD", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error("Error:", error));
};


  // State to track selected user and new message text

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
            setMessage(''); // Clear the input after sending
             fetchMessages(); // Refresh the message list after sending
        }
    } catch (error: any) {
        setError(error.message);
    }
};
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Extract distinct users from messages
  const users = Array.from(
    new Set(messages?.map((message) => message.recipient_id))
  ).map((id) => {
    const message = messages.find((msg) => msg.recipient_id === id);
    return {
      id,
      recipient_name: message?.recipients.recipient_name || "Unknown",
      facebook_id: message?.recipients.facebook_id,

    };
  });

  // Filter messages for the selected user
  const userMessages = messages.filter((message) => message.recipient_id === selectedUserId);

  const handleRecipientClick = (userId: number) => setSelectedUserId(userId);

  // const handleSendMessage = () => {
  //   if (newMessage.trim() && selectedUserId !== null) {
  //     const newMessageObj: Message = {
  //       id: messages.length + 1,
  //       text: newMessage,
  //       created_at: new Date().toISOString(),
  //       recipient_id: selectedUserId,
  //       message_id: null,
  //       fb_message_id: `m_${Math.random().toString(36).substring(2, 15)}`,
  //       fb_recipient_id: "generated_fb_recipient_id",
  //       recipient_name: null,
  //       recipients: { id: selectedUserId, recipient_name: users.find((user) => user.id === selectedUserId)?.recipient_name || "" },
  //     };
  //     setMessages((prevMessages) => [...prevMessages, newMessageObj]);
  //     setNewMessage("");
  //   }
  // };

  const renderContactsList = () => (
    <div className={`w-full ${!isMobileView ? 'md:w-1/3 lg:w-1.4/4' : ''} h-[700px] rounded bg-gradient-to-t from-black to-slate-500 border-r p-4 overflow-y-auto`}>
      <h3 className="text-xl text-gray-300 font-serif font-bold mb-4">Contacts</h3>
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => {handleRecipientClick(user.id)
            setRecipientId(user.facebook_id)
            setSenderName(user.recipient_name)
            console.log(user,'______setRecipientId')
          }}
          className={` w-full text-left rounded-lg flex items-center gap-2 mb-2 ${
            selectedUserId === user.id ? "bg-blue-100" : "hover:bg-gray-500"
          }`}
        >
          <span className="font-semibold font-serif text-black">{user.recipient_name}</span>
        </button>
      ))}
    </div>
  );

  const renderChatMessages = () => (
    <div className={`flex flex-col w-full ${!isMobileView ? 'md:w-2/3 lg:w-3/4' : ''}`}>
      <div className="bg-gradient-to-l from-black to-slate-500 text-white p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {users.find((user) => user.id === selectedUserId)?.recipient_name || "No Recipient Selected"}
        </h3>
        <button
          onClick={() => setSelectedUserId(null)}
          className="text-white text-sm bg-gray-800 px-3 py-1 rounded-lg hover:bg-gray-600"
        >
          Back to Contacts
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {userMessages.length ? (
          <ul className="space-y-3">
            {userMessages.map((message) => (
              <li
                key={message.id}
                className={`p-3 rounded-lg shadow-md text-gray-800 max-w-xs ${
                  message.recipient_id === selectedUserId ? "bg-blue-200 ml-auto text-right" :  "bg-white mr-auto"
                }`}
              >
                {message.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No messages with this user.</p>
        )}
      </div>

      <div className="p-4 border-t bg-white flex items-center">
        <input
          type="text"
           value={message}
                            onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-3 rounded-lg border focus:outline-none text-white bg-gradient-to-t from-black to-slate-500 focus:ring focus:ring-blue-200 mr-2"
        />
        <button
          onClick={handleSubmit}
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
          <p className= " hidden md:text-gray-600">Please select a chat. Your messages will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ModalChats;
