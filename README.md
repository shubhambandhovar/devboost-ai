# DevBoost AI 🚀

A full-stack AI-powered developer productivity web application designed to automate repetitive coding tasks and improve workflow efficiency using GenAI.

## 🌟 Features

1. **Code Explainer**: Paste any complex code snippet and get a simple, beginner-friendly explanation.
2. **README Generator**: Automatically generate professional `README.md` files by just providing your project name, features, and tech stack.
3. **Commit Message Generator**: Generate clean, standard Git commit messages based on your code changes or `git diff`.
4. **Bug Debug Assistant**: Paste error messages or stack traces to get an explanation of the bug and a possible solution.

## 💻 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Lucide React (Icons)
- **Backend**: Node.js, Express.js
- **AI Integration**: Google Gemini API (`@google/genai`)

## 📂 Folder Structure

```
devboost-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # API utility functions
│   │   ├── App.jsx         # Main application layout & routing
│   │   └── index.css       # Tailwind CSS styles
│   ├── .env                # Frontend environment variables
│   └── tailwind.config.js  # Tailwind configuration
└── server/                 # Express backend
    ├── controllers/        # AI controller logic (Gemini API calls)
    ├── routes/             # Express API routes
    ├── index.js            # Server entry point
    └── .env                # Backend environment variables (Gemini API Key)
```

## 🛠️ Installation Steps

### Prerequisites
- Node.js installed (v16+)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd devboost-ai
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your Gemini API Key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
Start the backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend server:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## 🚀 Deployment Steps

### Deploying the Backend on Render
1. Push your code to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the `server` directory as the Root Directory.
4. Set the Build Command to `npm install` and the Start Command to `node index.js`.
5. Add the Environment Variables: `PORT=5000` and `GEMINI_API_KEY=your_gemini_api_key`.
6. Click Deploy. Once deployed, copy the Render URL.

### Deploying the Frontend on Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. Set the Framework Preset to **Vite** and the Root Directory to `client`.
4. Add the Environment Variable `VITE_API_URL` and set its value to your Render backend URL (e.g., `https://your-backend.onrender.com/api`).
5. Click **Deploy**.

## 🧠 Sample Prompts Used Internally

The backend uses custom-engineered prompts to communicate with the Gemini API for optimal results:

1. **Code Explainer**:
   > Explain the following code in simple, beginner-friendly language: \n\n[USER_CODE]

2. **README Generator**:
   > Create a professional README.md for a project named "[PROJECT_NAME]". Features: [FEATURES] Tech Stack: [TECH_STACK] \n\nFormat the output in proper markdown. Include an introduction, features list, tech stack section, installation steps, and usage section.

3. **Commit Message Generator**:
   > Generate a clean, Git-style commit message based on the following code changes or description. Return ONLY the commit message without any extra text or formatting: \n\n[USER_CHANGES]

4. **Bug Debug Assistant**:
   > Act as an expert developer. Analyze the following error message, explain the possible issue in simple terms, and provide a clear solution: \n\n[ERROR_MESSAGE]
