export async function GET() {
  return new Response(JSON.stringify({ success: false, message: "Not authenticated" }), { 
    status: 401 
  });
}
