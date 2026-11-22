import dotenv from 'dotenv';
dotenv.config();

/**
 * System instruction for the TripTales Travel Assistant
 */
const SYSTEM_INSTRUCTION = `You are TripTales AI, a world-class travel planning expert, local insider, and compassionate travel companion.
Your mission is to provide fresh, deeply personalized, actionable, and culturally rich travel guidance.

CRITICAL RULES:
1. NEVER give generic, canned, or repetitive responses. Every answer MUST be specifically tailored to the user's exact destination, question, duration, budget, and group composition.
2. For specific itineraries, provide structured Day-by-Day plans including Morning, Afternoon, Evening, Local Cuisine Recommendations, and Insider Tips.
3. Distinguish clearly between verified recommendations and estimates. Clearly state that hotel tariffs, transport fares, and entry fees vary by season and booking platform.
4. If the user asks about spiritual or pilgrimage journeys (e.g., Char Dham, Varanasi, Tirupati), treat the cultural and spiritual customs with deep respect and detail optimal temple timings, rituals, and dress codes.
5. If important context is missing (like budget level or travel season), provide a great baseline plan while politely offering to fine-tune it based on their preferences.
6. Provide practical advice on weather, clothing, packing essentials, and local transportation options (e.g. state buses, local trains, shared cabs).
7. Format responses using clean Markdown with clear headings, bullet points, and bold highlights for effortless reading.`;

/**
 * Call Gemini API using Google REST endpoint or official SDK
 */
export async function generateGeminiResponse({ prompt, history = [], systemInstruction = SYSTEM_INSTRUCTION, jsonMode = false }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please add your real Gemini API key to the .env file in the project root to enable AI features.');
  }

  // Format contents for Gemini API (contents: array of { role: 'user'|'model', parts: [{ text }] })
  const contents = [];

  // Add conversation history if present
  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history) {
      if (msg.role && msg.content) {
        contents.push({
          role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }
  }

  // Add current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  // Current active Gemini models (gemini-3.5-flash-lite is fastest and reliable, gemini-3.8-flash is balanced)
  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 3000,
          ...(jsonMode ? { responseMimeType: 'application/json' } : {})
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${res.status} ${res.statusText}`;
        throw new Error(`Gemini API [${model}] error: ${errMsg}`);
      }

      const data = await res.json();
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.map(p => p.text).join('') || '';

      if (!text) {
        throw new Error('Received empty response from Gemini API.');
      }

      return text;
    } catch (err) {
      lastError = err;
      // If error is about API key invalidity, don't retry other models with the same invalid key
      if (err.message.includes('API_KEY_INVALID') || err.message.includes('API key not valid')) {
        throw new Error('The provided GEMINI_API_KEY is invalid. Please verify your API key in Google AI Studio.');
      }
      // If model had high demand spike (503) or not found, retry next model
      console.warn(`Attempt with ${model} failed: ${err.message}. Retrying with alternate model...`);
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini API.');
}
