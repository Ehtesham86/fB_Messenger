import { NextResponse } from 'next/server';
import { createClient as createClientUser } from '@/utils/supabase/server';

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*'); // Replace with your origin
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}

// POST handler for saving messages
export async function POST(request) {
    const supabase = createClientUser(); // Initialize Supabase client

    try {
        const body = await request.json();
        const { id, message } = body;
console.log(body,'____+body')
        // Validate inputs
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Insert the message into the audience table
        const { error } = await supabase
            .from('audience')
            .insert({ allowedId: id, message });

        if (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Message saved successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET handler for fetching messages based on allowedId
export async function GET(request) {
    const supabase = createClientUser(); // Initialize Supabase client

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id'); // Retrieve `id` from query string

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Fetch messages based on allowedId
        const { data: messages, error } = await supabase
            .from('audience')
            .select('id, message, created_at')
            .eq('allowedId', id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
        }
console.log(data)
        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

