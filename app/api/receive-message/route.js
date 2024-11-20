import { NextResponse } from 'next/server';
import { createClient as createClientUser } from '@/utils/supabase/server';

const ALLOWED_ID = '121212'; // Replace with the required id

export async function OPTIONS() {
    
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*'); // Replace with your origin
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}

export async function POST(request) {
    const supabase = createClientUser();

    try {
        const body = await request.json();
        const { id, message } = body;

        // Validate the presence of id
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Validate the id value
        if (id !== ALLOWED_ID) {
            return NextResponse.json({ error: 'Unauthorized ID' }, { status: 403 });
        }

        // Validate the presence of message
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        console.log(`Received message for ID ${id}:`, message);

        const response = NextResponse.json({
            message: `Message received successfully for ID ${id}: ${message}`,
        });

        // Set CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*'); // Replace with your origin
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
    }
}
