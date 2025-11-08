import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Generate quiz questions
app.post('/api/generate-quiz', async (req, res) => {
    try {
        const { topic, numberOfQuestions = 5 } = req.body;

        const prompt = `Create a practice quiz about ${topic} with ${numberOfQuestions} questions. 
        Format each question with:
        1. The question
        2. Four multiple choice options (A, B, C, D)
        3. The correct answer
        
        Make the questions challenging but appropriate for a student learning this topic.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        res.json({ 
            success: true, 
            quiz: completion.choices[0].message.content 
        });
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate quiz' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
