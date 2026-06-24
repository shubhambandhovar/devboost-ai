const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    const dbType = 'PostgreSQL';
    const description = 'A rental car service with users, cars, bookings, payments, and reviews';
    
    const prompt = `Act as an expert Database Architect. Generate a complete database schema based on the following description: "${description}".
    The target database/ORM type is: ${dbType} (e.g., PostgreSQL/SQL, MongoDB/Mongoose, Prisma, MySQL).
    
    1. If it's a SQL database, provide the exact CREATE TABLE statements with appropriate constraints, primary/foreign keys, and data types.
    2. If it's Mongoose/Prisma, provide the exact schema definitions.
    3. Always generate a Mermaid.js Entity-Relationship (ER) diagram representing the tables and their relations.
       Format it in a fenced code block with the 'mermaid' language identifier, like:
       \`\`\`mermaid
       erDiagram
         USER ||--o{ POST : writes
       \`\`\`
       Ensure correct Mermaid syntax (no HTML tags, use double quotes for labels, and standard ER diagram symbols like ||--o{, }|--||, etc.).
       
    Keep explanations and queries to an absolute minimum or omit them entirely to ensure the generation is extremely fast (must complete in under 15 seconds). Provide the code in proper markdown code blocks.`;

    console.log('Generating content from Gemini (concise)...');
    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const duration = (Date.now() - startTime) / 1000;
    console.log(`Generation finished in ${duration} seconds.`);
    
    console.log('=== AI Response ===');
    console.log(response.text);
    
    const hasMermaid = response.text.includes('```mermaid');
    console.log('\nHas Mermaid block:', hasMermaid);
  } catch (error) {
    console.error('Failed:', error);
  }
}

run();
