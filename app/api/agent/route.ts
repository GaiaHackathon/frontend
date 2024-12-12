import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const data = await req.json();
  const image_url = data.image_url;

  const completion = await openai.chat.completions.create({
    model: 'x-ai/grok-vision-beta',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze the left and the right image for posture and spine alignement differences. Keep it short and concise.',
          },
          {
            type: 'image_url',
            image_url: {
              url: image_url,
            },
          },
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
