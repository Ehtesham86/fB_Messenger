// app/api/auth/route.js
import axios from 'axios';

export async function POST(req) {
  const { email } = await req.json(); // Parse the JSON body

  try {
    const response = await axios.post(`https://us15.api.mailchimp.com/3.0/lists/ff556f2fc2/members`, {
      email_address: email,
      status: 'subscribed',
    }, {
      headers: {
        'Authorization': `apikey ad9a7225235affcfd13c3dc120b69afb`,
        'Content-Type': 'application/json',
      },
    });

    return new Response(JSON.stringify({ message: 'Successfully subscribed!', data: response.data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error subscribing', error: error.response ? error.response.data : error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}