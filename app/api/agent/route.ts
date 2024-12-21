export async function POST(req: Request) {
  let data;
  try {
    data = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body: ' + error }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Ensure `before_url` is present
  if (!data.before_url) {
    return new Response(
      JSON.stringify({ error: 'Before image URL is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
 

  return new Response(
    JSON.stringify({ message: "This is a placeholder message." }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
