"use client"
import React, { useState } from "react";

const AuthMailchimp: React.FC = () => {
  // State types for email and error
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Redirect to Mailchimp OAuth page
  const handleConnect = () => {
    if (!email) {
      setError('Please enter a valid Mailchimp account email.');
      return;
    }
  
    // const CLIENT_ID = 'ad9a7225235affcfd13c3dc120b69afb-us15'; // Your Mailchimp client ID
    const CLIENT_ID = 'ff556f2fc2'; // Your Mailchimp client ID

    const REDIRECT_URI = 'http://127.0.0.1:3000/authmailchimp'; // Your redirect URI
    const SCOPE = 'read,write'; // Permissions you need
  
    // Construct the OAuth URL
    const oauthUrl = `https://login.mailchimp.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}`;
  
    // Redirect to Mailchimp's OAuth authorization page
    window.location.href = oauthUrl;
  };
    
  return (
    <div>
      <h2>Connect to Mailchimp</h2>
      <input
        type="email"
        value={email}
        style={{ color: "red" }}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your Mailchimp account email"
      />
      <button onClick={handleConnect}>Connect</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AuthMailchimp;
