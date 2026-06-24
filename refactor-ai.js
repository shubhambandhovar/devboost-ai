const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'controllers', 'aiController.js');
let code = fs.readFileSync(filePath, 'utf8');

const fallbackFunction = `
const callGeminiWithFallback = async (contents) => {
  try {
    return await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });
  } catch (error) {
    if (error.status === 503 || (error.message && error.message.includes('503'))) {
      console.warn('Gemini 2.5 Flash is unavailable (503). Falling back to Gemini 1.5 Flash...');
      return await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: contents,
      });
    }
    throw error;
  }
};
`;

// Insert the fallback function after cleanMarkdown definition
code = code.replace(/const cleanMarkdown = [\s\S]*?;\n\n/, match => match + fallbackFunction + '\n');

// Replace all occurrences of ai.models.generateContent (except the ones in our new helper)
code = code.replace(/const response = await ai\.models\.generateContent\(\{\s*model:\s*'gemini-2\.5-flash',\s*contents:\s*(prompt|contents),\s*\}\);/g, 'const response = await callGeminiWithFallback($1);');

fs.writeFileSync(filePath, code);
console.log('Successfully refactored aiController.js to use fallback logic.');
