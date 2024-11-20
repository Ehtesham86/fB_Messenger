import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const CallbackPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the query parameters are loaded before trying to extract 'code'
    if (router.isReady) {
      const { code } = router.query; // Extract the authorization code from the query params

      if (!code) {
        setError("No authorization code found. Please try again.");
        return;
      }

      const CLIENT_ID = "ff556f2fc2"; // Your Mailchimp client ID
      const CLIENT_SECRET = "ad9a7225235affcfd13c3dc120b69afb-us15"; // Your Mailchimp client secret
      const REDIRECT_URI = "http://localhost:3000/callback"; // Your redirect URI

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code as string, // Ensure 'code' is a string
        redirect_uri: REDIRECT_URI,
      });

      fetch("https://login.mailchimp.com/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setAccessToken(data.access_token); // Set the access token
          } else {
            setError("Failed to exchange code for token.");
          }
        })
        .catch((err) => {
          setError("An error occurred while exchanging the code.");
          console.error(err);
        });
    }
  }, [router.query, router.isReady]); // Ensure it runs only after router query is ready

  return (
    <div>
      <h2>Callback</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {accessToken && (
        <div>
          <p>Access Token:</p>
          <pre>{accessToken}</pre>
        </div>
      )}
    </div>
  );
};

export default CallbackPage;
