// app/api/messagestest/route.js
export async function GET(req) {
    return new Response(JSON.stringify({ message: "Hello from Next.js API route" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  