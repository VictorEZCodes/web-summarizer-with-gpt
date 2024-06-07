require('dotenv').config(); // Load environment variables

const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/summarize', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        console.log(`Fetching content from: ${url}`);

        // Launch headless browser with Puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const content = await page.evaluate(() => document.body.innerText);
        await browser.close();

        console.log(`Content fetched: ${content.substring(0, 200)}...`);

        // Send extracted text to OpenAI for summarization
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "Please summarize this text." },
                    { role: "user", content: content }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`OpenAI response: ${JSON.stringify(response.data)}`);

        // Send the summary back to the client
        res.json({ summary: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error.message || error);
        res.status(500).json({ error: 'Failed to process the summarization request' });
    }
});

// Listen on localhost only if not in production
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
} else {
    app.listen(PORT); // Make sure the app listens on Heroku
}

module.exports = app;
