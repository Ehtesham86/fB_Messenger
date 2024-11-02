'use client';

import { useEffect, useState, FormEvent } from 'react';

interface ApiResponse {
    success: boolean;
    data?: any; // You can specify the type based on your response structure
    error?: any; // You can specify the type based on your error structure
}

interface Message {
    id: number;
    text: string;
    created_at: string;
    recipient_id: string;
    sender_name: string; // Add sender name to the Message interface
    recipients:any
}

function SendMessage() {
    const [message, setMessage] = useState<string>('');
    const [recipientId, setRecipientId] = useState<string>('8805839732787665'); // Default recipient ID
    const [senderName, setSenderName] = useState<string>(''); // State for sender's name
    const [messages, setMessages] = useState<Message[]>([]);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                setSenderName(''); // Clear the sender name input
                fetchMessages(); // Refresh the message list after sending
            }
        } catch (error: any) {
            setError(error.message);
        }
    };
    return (
        <div style={{ padding: '20px' }}>
            <h1>Chat</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div>
                    <label>
                        Your Name:
                        <input
                            style={{ color: 'black', margin: '0 10px' }}
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Message:
                        <input
                            style={{ color: 'black', margin: '0 10px' }}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Recipient ID:
                        <input
                            style={{ color: 'black', margin: '0 10px' }}
                            type="text"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Send</button>
            </form>

            {response && <div style={{ color: 'green' }}>Message sent successfully!</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <h2>Messages</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                        <strong>{msg.recipients.recipient_name || 'Unknown Sender'}</strong>: {msg.text}
                        <div style={{ fontSize: '0.8em', color: '#666' }}>{new Date(msg.created_at).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SendMessage;
