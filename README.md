# AI-Tutor

This project is a minimal frontend + backend example that lets you send prompts to the OpenAI Chat API without exposing your API key in client-side code.

Setup
1. Copy `.env.example` to `.env` and set your OpenAI API key:

	OPENAI_API_KEY=sk-...your key...

2. Install dependencies:

	npm install

3. Start the server (development with auto-reload):

	npm run dev

	or production:

	npm start

4. Open http://localhost:3000 in your browser and use the chat UI.

Notes
- The server serves the static files and exposes `POST /api/chat` which proxies to OpenAI.
- Keep your `.env` out of version control (see `.gitignore`).
