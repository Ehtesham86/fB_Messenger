// app/api/auth/route.js
import axios from 'axios';

export async function POST(req) {
  const { emails } = await req.json(); // Expecting an array of emails

  const responses = [];
  for (const email of emails) {
    try {
      const response = await axios.post(
        `https://us15.api.mailchimp.com/3.0/lists/ff556f2fc2/members`,
        {
          email_address: email,
          status: 'subscribed',
        },
        {
          headers: {
            Authorization: `apikey ad9a7225235affcfd13c3dc120b69afb`,
            'Content-Type': 'application/json',
          }
        }
      );
      responses.push({ email, message: 'Successfully subscribed!', data: response.data });
    } catch (error) {
      responses.push({
        email,
        message: 'Error subscribing',
        error: error.response ? error.response.data : error.message,
      });
    }
  }

  return new Response(JSON.stringify(responses), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
