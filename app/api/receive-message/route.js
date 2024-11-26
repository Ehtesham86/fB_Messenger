import { NextResponse } from 'next/server';
import { createClient as createClientUser } from '@/utils/supabase/server';

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}

export async function POST(request) {
    const supabase = createClientUser();

    try {
        const body = await request.json();
        const { id, message } = body;
        console.log(body)

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Check if the `id` exists in the `users` table
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', id)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 404 });
        }

        // Insert the message into the `audience` table
        const { error: insertError } = await supabase
            .from('audience')
            .insert([{ allowedId: id, message }]);

        if (insertError) {
            console.error('Database Error:', insertError);
            return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
        }

        return NextResponse.json({
            message: `Message saved successfully for User ID ${id}`,
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    const supabase = createClientUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        // Fetch messages for the given ID
        const { data, error } = await supabase
            .from('audience')
            .select('message, created_at')
            .eq('allowedId', id);

        if (error || !data.length) {
            return NextResponse.json({ error: 'No messages found for the provided ID' }, { status: 404 });
        }
console.log(data)
        const response = NextResponse.json({ messages: data }, { status: 200 });
        response.headers.set('Access-Control-Allow-Origin', '*'); // Ensure CORS header is set here
        return response;
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
