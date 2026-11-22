import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();
console.log('Testing key starting with:', apiKey?.substring(0, 10));

async function testModels() {
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const model of models) {
    try {
      console.log(`\nTesting model: ${model} via generateContent...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Hello, respond with 3 words' }] }]
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(`❌ ${model} failed HTTP ${res.status}:`, data.error?.message);
      } else {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`✅ ${model} SUCCESS:`, text?.trim());
      }
    } catch (e) {
      console.log(`❌ ${model} exception:`, e.message);
    }
  }

  // Also test @google/genai SDK
  try {
    console.log('\nTesting @google/genai SDK...');
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    
    // Test interactions.create
    try {
      console.log('Testing ai.interactions.create(gemini-3.8-flash)...');
      const response = await ai.interactions.create({
        model: 'gemini-3.8-flash',
        input: 'Hello, respond with 3 words',
      });
      console.log('✅ SDK interactions SUCCESS:', response.output_text);
    } catch (sdkErr) {
      console.log('❌ SDK interactions error:', sdkErr.message);
    }
  } catch (err) {
    console.log('❌ SDK import error:', err.message);
  }
}

testModels();
