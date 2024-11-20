"use client";
import { useState } from "react";

export default function SubscribeButton() {
  const [message, setMessage] = useState<string>(''); // State to hold the response message

  const dummyEmails: string[] = [
    "uk362349@gmail.com",
    "ranaabdullahazam102@gmail.com",
    "talhakazmi@bredware.com",
    "susan.brown@example.com",
  ];

  const handleSubscribe = async (): Promise<void> => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: dummyEmails }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(JSON.stringify(data, null, 2)); // Display the response
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Error: ${errorMessage}`);
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe}>Subscribe 10 Dummy Emails</button>
      {message && <pre style={{ textAlign: "left" }}>{message}</pre>}
    </div>
  );
}
