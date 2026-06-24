const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'controllers', 'aiController.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace the fallback function
const fallbackFunction = `
const callGeminiWithFallback = async (contents) => {
  try {
    return await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });
  } catch (error) {
    const isRateLimitOrUnavailable = error.status === 503 || error.status === 429 || (error.message && (error.message.includes('503') || error.message.includes('429') || error.message.includes('quota')));
    
    if (isRateLimitOrUnavailable) {
      console.warn('Gemini 2.5 Flash is unavailable/rate-limited. Falling back to Gemini 1.5 Flash...');
      try {
        return await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: contents,
        });
      } catch (fallbackError) {
         if (fallbackError.status === 429 || (fallbackError.message && fallbackError.message.includes('quota'))) {
            const err = new Error('AI Rate Limit Exceeded. Please wait 60 seconds and try again.');
            err.status = 429;
            throw err;
         }
         throw fallbackError;
      }
    }
    throw error;
  }
};
`;

code = code.replace(/const callGeminiWithFallback = async [\s\S]*?^};\n/m, fallbackFunction.trim() + '\n');

// Replace all catch blocks
code = code.replace(/} catch \(error\) {\n\s*console\.error\('Error (.*?)',\s*error\);\n\s*res\.status\(500\)\.json\({ error: '(.*?)' }\);\n\s*}/g, 
  `} catch (error) {\n    console.error('Error $1', error);\n    const status = error.status || 500;\n    const message = error.status === 429 ? error.message : '$2';\n    res.status(status).json({ error: message });\n  }`);

fs.writeFileSync(filePath, code);
console.log('Successfully refactored aiController.js to handle 429 Rate Limits.');
