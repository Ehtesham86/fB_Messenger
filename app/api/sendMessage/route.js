import axios from 'axios';
import { createClient as createClientUser } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const supabase = createClientUser();
    const { message, recipientId, senderName } = await req.json();

    const accessToken = 'EAAH20PSWGqEBO9FzDZBIS5FkZBfyliVUlPT2nVw1nZCqDl9tPqXQQbanR2tHOqGBRNgrFFd3zZCtCt22sDrNWk9vtiRFfVQjlInkvl228WmGmnaNhAQzTMOmn2j1HVPZB0hv1qZBbSaJ9yX5GbffZBVXEfUh7Wvut5aGDBB6odMREvAgE6kEUxGrAZBUjQ1mZCrtBM5CuT0rsLZCZB34GM9eZBBnESsZD'; // replace with your actual access token

    try {
        // Check if recipient exists
        const { data: recipientData, error: recipientError } = await supabase
            .from('recipients')
            .select('id')
            .eq('facebook_id', recipientId)
            .single();

        let recipientIdToUse;

        // If recipient does not exist, create it
        if (recipientError || !recipientData) {
            const { data: newRecipient, error: newRecipientError } = await supabase
                .from('recipients')
                .insert([{ recipient_name: senderName, facebook_id: recipientId }])
                .select();

            if (newRecipientError) {
                console.error('Error inserting recipient:', newRecipientError);
                throw new Error(`Failed to create recipient: ${newRecipientError.message}`);
            }

            recipientIdToUse = newRecipient[0].id;
        } else {
            recipientIdToUse = recipientData.id;
        }

        // Send message to Facebook
        const fbResponse = await axios.post(
            `https://graph.facebook.com/v21.0/110689178427068/messages?access_token=${accessToken}`,
            {
                recipient: { id: recipientId },
                messaging_type: 'RESPONSE',
                message: { text: message },
            }
        );

        // Check if the Facebook response contains expected data
        const fbRecipientId = fbResponse?.data?.recipient_id;
        const fbMessageId = fbResponse?.data?.message_id;

        if (!fbRecipientId || !fbMessageId) {
            throw new Error('Failed to retrieve recipient_id or message_id from Facebook API response');
        }

        // Insert message into msgs_messender table with the correct recipient_id
        const { data, error } = await supabase
            .from('msgs_messender')
            .insert([{ text: message, recipient_id: recipientIdToUse, fb_recipient_id: fbRecipientId, fb_message_id: fbMessageId }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        return new Response(JSON.stringify({ success: true, fbResponse: fbResponse.data, dbResponse: data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in sending message:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
export async function GET(req) {
    const supabase = createClientUser();

    try {
        // Fetch messages with recipient_name from the related recipients table
        const { data: messages, error } = await supabase
            .from('msgs_messender')
            .select(`*,
                recipients:recipient_id (id,recipient_name,facebook_id)`);

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        return new Response(JSON.stringify({ success: true, messages }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

