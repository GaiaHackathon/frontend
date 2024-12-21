import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  let data;
  try {
    data = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
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
  const { before_url, after_url } = data;

  let prompt = 'Analyze this image for posture and spine alignment.';
  let images = [before_url];

  if (after_url) {
    prompt = 'Compare these before and after images for posture and spine alignment differences. Focus on improvements and changes. Keep it short and concise.';
    images = [before_url, after_url];
  }

  const completion = await openai.chat.completions.create({
    model: 'x-ai/grok-vision-beta',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          ...images.map(url => ({
            type: 'image_url',
            image_url: { url }
          }))
        ],
      },
    ],
  });

  return new Response(
    JSON.stringify({ message: completion.choices[0].message }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
