import { createClient as createClientUser } from '@/utils/supabase/server';

export async function POST(req) {
    const supabase = createClientUser();
    const body = await req.json();

    if (body.object === 'page') {
        for (const entry of body.entry) {
            const messaging = entry.messaging[0];
            const senderId = messaging.sender.id;
            const messageText = messaging.message.text;

            try {
                // Insert incoming message into the database
                await supabase
                    .from('msgs_messender')
                    .insert([{ text: messageText, recipient_id: senderId }]);

                // Emit an event via WebSocket or similar to update the frontend
                console.log('Message received and saved to database:', messageText);

            } catch (error) {
                console.error('Database insert error:', error);
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
        return new Response("Event not recognized", { status: 404 });
    }
}
