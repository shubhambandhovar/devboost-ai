const { GoogleGenAI } = require('@google/genai');
const History = require('../models/History');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const User = require('../models/User');

const saveHistory = async (reqUser, feature, input, output) => {
  if (reqUser) {
    try {
      await History.create({ user: reqUser, feature, input, output });
      // Increment user generations count
      await User.findByIdAndUpdate(reqUser, { $inc: { generationsCount: 1 } });
    } catch (err) {
      console.error('Failed to save history and increment usage:', err);
    }
  }
};

const cleanMarkdown = (text) => {
  // Remove starting ```markdown or ``` and ending ```
  return text.replace(/^```(?:markdown|md|html)?\n/i, '').replace(/\n```$/i, '').trim();
};

exports.explainCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });

    const prompt = `Explain the following code in simple, beginner-friendly language:\n\n${code}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Explain Code', { code }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error explaining code:', error);
    res.status(500).json({ error: 'Failed to explain code' });
  }
};

exports.generateReadme = async (req, res) => {
  try {
    const { projectName, features, techStack } = req.body;
    if (!projectName || !features || !techStack) {
      return res.status(400).json({ error: 'Project name, features, and tech stack are required' });
    }

    const prompt = `Create a professional README.md for a project named "${projectName}".\nFeatures: ${features}\nTech Stack: ${techStack}\n\nFormat the output in proper markdown. Do NOT wrap the entire response in a markdown code block. Return the raw text. Include an introduction, features list, tech stack section, installation steps, and usage section.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Generate README', { projectName, features, techStack }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error generating README:', error);
    res.status(500).json({ error: 'Failed to generate README' });
  }
};

exports.generateCommit = async (req, res) => {
  try {
    const { changes } = req.body;
    if (!changes) return res.status(400).json({ error: 'Changes are required' });

    const prompt = `Generate a clean, Git-style commit message based on the following code changes or description. Return ONLY the commit message without any extra text or formatting:\n\n${changes}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Generate Commit', { changes }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error generating commit message:', error);
    res.status(500).json({ error: 'Failed to generate commit message' });
  }
};

exports.debugBug = async (req, res) => {
  try {
    const { errorMessage } = req.body;
    if (!errorMessage) return res.status(400).json({ error: 'Error message is required' });

    const prompt = `Act as an expert developer. Analyze the following error message, explain the possible issue in simple terms, and provide a clear solution:\n\n${errorMessage}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Debug Bug', { errorMessage }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error debugging bug:', error);
    res.status(500).json({ error: 'Failed to debug bug' });
  }
};

exports.refactorCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });

    const prompt = `Act as an expert software engineer. Refactor the following messy or unoptimized code to make it clean, efficient, and follow modern best practices. Briefly explain what you optimized at the top:\n\n${code}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Refactor Code', { code }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error refactoring code:', error);
    res.status(500).json({ error: 'Failed to refactor code' });
  }
};

exports.translateCode = async (req, res) => {
  try {
    const { code, targetLanguage } = req.body;
    if (!code || !targetLanguage) return res.status(400).json({ error: 'Code and target language are required' });

    const prompt = `Translate the following code into ${targetLanguage}. Provide ONLY the translated code block and a brief explanation of any language-specific idioms used:\n\n${code}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Translate Code', { code, targetLanguage }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error translating code:', error);
    res.status(500).json({ error: 'Failed to translate code' });
  }
};

exports.generateRegex = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Description is required' });

    const prompt = `Generate a Regular Expression (Regex) that matches the following description: "${description}". Provide the exact regex pattern in a code block, followed by a brief explanation of how it works and a few examples of strings that it matches and doesn't match.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Regex Generator', { description }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error generating regex:', error);
    res.status(500).json({ error: 'Failed to generate regex' });
  }
};

exports.generateReadmeFromGithub = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'GitHub Repository URL is required' });

    // Extract owner and repo from URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return res.status(400).json({ error: 'Invalid GitHub URL format' });
    
    const owner = match[1];
    const repo = match[2].replace('.git', '');

    // Fetch repo details
    const [repoRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { 'User-Agent': 'DevBoost-AI' }
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: { 'User-Agent': 'DevBoost-AI' }
      })
    ]);

    if (!repoRes.ok) return res.status(404).json({ error: 'Repository not found or private' });

    const repoData = await repoRes.json();
    const langData = await langRes.json();

    const description = repoData.description || 'No description provided.';
    const languages = Object.keys(langData).join(', ');
    const topics = repoData.topics ? repoData.topics.join(', ') : 'None';

    const prompt = `Act as an expert technical writer. Create a professional and comprehensive README.md for the following GitHub repository based on its metadata.
    
Repository Name: ${repoData.name}
Owner: ${owner}
Description: ${description}
Primary Languages Used: ${languages}
Topics/Tags: ${topics}
Default Branch: ${repoData.default_branch}

Format the output in proper markdown. Do NOT wrap the entire response in a markdown code block. Return the raw text. 
Include an introduction, features section (inferred from description/topics), tech stack section (inferred from languages), a placeholder installation steps section (like git clone https://github.com/${owner}/${repo}.git), and usage section.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'GitHub README', { repoUrl }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error generating GitHub README:', error);
    res.status(500).json({ error: 'Failed to generate README from GitHub' });
  }
};

exports.generateUnitTest = async (req, res) => {
  try {
    const { code, framework } = req.body;
    if (!code || !framework) return res.status(400).json({ error: 'Code and testing framework are required' });

    const prompt = `Act as an expert QA and software engineer. Generate a comprehensive suite of unit tests for the following code using the ${framework} testing framework. 
    Ensure you cover the happy path, edge cases, and potential error states.
    Provide ONLY the code block containing the tests and a brief explanation of what edge cases were covered:\n\n${code}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Generate Unit Test', { code, framework }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error generating unit test:', error);
    res.status(500).json({ error: 'Failed to generate unit test' });
  }
};

exports.scanSecurity = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required for security scanning' });

    const prompt = `Act as an expert Senior Application Security Engineer. Perform a comprehensive security review and vulnerability scan on the following code.
    1. Identify any potential security flaws (e.g., SQL Injection, XSS, insecure cryptography, memory leaks, OWASP Top 10 vulnerabilities).
    2. Explain the risk of each flaw in plain English.
    3. Provide a secure, refactored version of the code that mitigates these vulnerabilities.
    If the code appears perfectly secure, state that, but suggest any general hardening best practices:\n\n${code}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Security Scan', { code }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error scanning security:', error);
    res.status(500).json({ error: 'Failed to complete security scan' });
  }
};

exports.generateDatabase = async (req, res) => {
  try {
    const { description, dbType } = req.body;
    if (!description || !dbType) return res.status(400).json({ error: 'Description and database type are required' });

    const prompt = `Act as an expert Database Architect. Generate a complete database schema based on the following description: "${description}".
    The target database/ORM type is: ${dbType} (e.g., PostgreSQL/SQL, MongoDB/Mongoose, Prisma, MySQL).
    
    1. If it's a SQL database, provide the exact CREATE TABLE statements with appropriate constraints, primary/foreign keys, and data types.
    2. If it's Mongoose/Prisma, provide the exact schema definitions.
    3. Include 1 or 2 complex example queries (e.g., JOINs, aggregations) that would be common for this app.
    4. Briefly explain your design choices (e.g., why you used certain relationships or indexes).
    5. Always generate a Mermaid.js Entity-Relationship (ER) diagram representing the tables and their relations.
       Format it in a fenced code block with the 'mermaid' language identifier, like:
       \`\`\`mermaid
       erDiagram
         USER ||--o{ POST : writes
       \`\`\`
       Ensure correct Mermaid syntax (no HTML tags, use double quotes for labels, and standard ER diagram symbols like ||--o{, }|--||, etc.).
       
    Provide the code in proper markdown code blocks.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Database Generator', { description, dbType }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error generating database schema:', error);
    res.status(500).json({ error: 'Failed to generate database schema' });
  }
};

exports.planArchitecture = async (req, res) => {
  try {
    const { requirements } = req.body;
    if (!requirements) return res.status(400).json({ error: 'Requirements are required' });

    const prompt = `Act as an expert Principal Cloud Solutions Architect. Design a high-level system architecture based on the following product requirements: "${requirements}".
    
    Please provide a comprehensive system design document including:
    1. **High-Level Architecture Overview**: A brief summary of the system.
    2. **Component Breakdown**: Describe the Frontend, Backend, Database, and Caching layers.
    3. **Cloud Infrastructure & Services**: Recommend specific services (e.g., AWS S3, Redis, Docker, Kubernetes, WebSockets) and explain *why*.
    4. **Data Flow**: Explain how data moves through the system from the user request to the database.
    5. **Scalability & Security Considerations**: How will the system handle high traffic and remain secure?
    
    Format the output in clean, readable markdown using appropriate headings, bullet points, and bold text.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = cleanMarkdown(response.text);
    await saveHistory(req.user, 'Architecture Planner', { requirements }, output);
    res.json({ result: output });
  } catch (error) {
    console.error('Error planning architecture:', error);
    res.status(500).json({ error: 'Failed to plan architecture' });
  }
};

exports.aiChat = async (req, res) => {
  try {
    const { history, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Format history for Gemini API
    const contents = history ? [...history] : [];
    
    // Add the new user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // We use a system instruction context to make it a great developer assistant
    // However, google/genai structure requires system instructions separately or as first message.
    // For simplicity, if history is empty, we inject context into the first message.
    if (contents.length === 1) {
      contents[0].parts[0].text = `Act as DevBoost AI, an expert software engineer, architect, and developer assistant. Be concise, accurate, and provide code examples where helpful. User query: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    const output = cleanMarkdown(response.text);
    
    // We optionally save to history only if it's the first message to avoid spamming the DB,
    // or just save the individual interaction. Let's save the interaction.
    await saveHistory(req.user, 'AI Chat', { message }, output);
    
    res.json({ result: output });
  } catch (error) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};
