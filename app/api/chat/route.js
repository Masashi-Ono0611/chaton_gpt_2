// app/api/chat/route.js

export async function POST(request) {
  try {
      const { prompt } = await request.json();

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 100,
          }),
      });

      if (!response.ok) {
          throw new Error(`OpenAI API request failed with status ${response.status}`);
      }

      const data = await response.json();

      return new Response(JSON.stringify({ message: data.choices[0].message.content }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });

  } catch (error) {
      console.error("Error occurred:", error);  // error をログとして記録
      return new Response(JSON.stringify({ error: "Failed to fetch response from OpenAI" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }
}
