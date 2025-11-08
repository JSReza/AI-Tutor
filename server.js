// Lightweight Express server that proxies requests to the OpenAI API.
// Reads OPENAI_API_KEY from process.env and serves the static frontend.

import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn("Warning: OPENAI_API_KEY is not set. Set it in a .env file based on .env.example.");
}

const client = new OpenAI({ apiKey });

app.use(express.json());

// Serve static files from project root so you can open http://localhost:3000
app.use(express.static(path.resolve('.')));

// Simple POST endpoint that accepts { message } and returns { reply }
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message in request body' });

    const resp = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI tutor.' },
        { role: 'user', content: message }
      ],
      max_tokens: 800
    });

    const reply = resp.choices?.[0]?.message?.content ?? 'No reply from model';
    res.json({ reply });
  } catch (err) {
    console.error('Error in /api/chat', err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
