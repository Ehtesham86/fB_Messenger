"use client"
// app/SubscribeButton/SubscribeButton.js
import { useState } from 'react';

export default function SubscribeButton() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text(); // Get the error message
      throw new Error(errorMessage);
    }
  
    const data = await response.json(); // This will now work correctly
    setMessage(data.message);
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ color: "red" }}

        placeholder="Enter your email"
      />
      <button onClick={handleSubscribe}>Subscribe</button>
      {message && <p>{message}</p>}
    </div>
  );
}