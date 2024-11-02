import axios from 'axios';

export async function POST(req) {
    const { message, recipientId } = await req.json();

    const accessToken = 'EAAH20PSWGqEBOy06ZCRmgvNLJeTwsfxHzpjcZAQ3wNUsonWrrX6LWN2FSyVQ0fYkfjDnmjIhKEuLFMgF8Sn8EFOfTpJnv8xBm85sqSoqFviP5Pj1EWXhy3CYgt3xurqQz0mNl0iojcEyU82jgXeJjvA2E4DY3dobCZBB4PWLphacPso1QODB4cZBxvISZBjWlrSEMsflbmGzgP8Ylbou04HoZD';

    try {
        const response = await axios.post(`https://graph.facebook.com/v21.0/110689178427068/messages?access_token=${accessToken}`, {
            recipient: { id: recipientId },
            messaging_type: 'RESPONSE',
            message: { text: message },
        });

        return new Response(JSON.stringify({ success: true, data: response.data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: error.response?.data || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
