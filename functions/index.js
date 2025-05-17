const functions = require('firebase-functions');
const express   = require('express');
const { OpenAI } = require('openai');
const axios     = require('axios');

const app = express();
app.use(express.json());

// 1) Gemini chat via REST
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-chat:generateMessage',
      { prompt: { messages: req.body.messages } },
      { headers: { Authorization: `Bearer ${functions.config().google.api_key}` } }
    );
    res.json(response.data);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

// 2) OpenAI image generation
const openai = new OpenAI({ apiKey: functions.config().openai.key });
app.post('/api/image', async (req, res) => {
  try {
    const img = await openai.images.generate({
      prompt: req.body.prompt,
      size: '512x512'
    });
    res.json(img);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

// 3) OpenAI text-to-speech
app.post('/api/tts', async (req, res) => {
  try {
    const audio = await openai.audio.speech.generate({
      model: 'tts-1',
      input: req.body.text,
      voice: 'alloy'
    });
    res.json(audio);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

// 4) Google Custom Search
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: 'Missing q query parameter' });
  }
  try {
    const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: functions.config().google.api_key,
        cx: functions.config().google.search_cx,
        q
      }
    });
    res.json(data);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

// Export as a single HTTPS function
exports.api = functions.https.onRequest(app);

