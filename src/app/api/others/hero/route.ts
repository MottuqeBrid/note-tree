export async function GET() {
  const hero = {
    slogan: "Organize Your Thoughts with NoteTree",
    subSlogan:
      "Create, manage, and track your notes seamlessly. NoteTree helps you stay organized, boost productivity, and never lose track of your ideas.",
    image: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return new Response(JSON.stringify({ success: true, hero }), { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hero } = body;

    return new Response(JSON.stringify({ success: true, hero }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Invalid request" }), { status: 400 });
  }
}
