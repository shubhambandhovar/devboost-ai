const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Using API Key:', apiKey ? 'FOUND (' + apiKey.substring(0, 8) + '...)' : 'MISSING');

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not defined in .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    console.log('Calling Gemini API...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello, respond with "OK" if you receive this message.',
    });
    console.log('Response status: SUCCESS');
    console.log('Response text:', response.text);
  } catch (error) {
    console.error('API Call Failed:', error);
  }
}

run();
