# Awesome Chatbot Firebase Function

This repository contains an Express application bundled as a single Firebase Cloud Function. The function exposes three endpoints under `/api` for Gemini chat, OpenAI image generation and OpenAI text-to-speech.

## Installation

1. Install the [Firebase CLI](https://firebase.google.com/docs/cli) if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```
2. Install dependencies inside the `functions` directory:
   ```bash
   cd functions
   npm install
   ```
3. Configure the required environment variables using `firebase functions:config:set`:
   ```bash
   firebase functions:config:set openai.key="<YOUR_OPENAI_KEY>" google.api_key="<YOUR_GOOGLE_API_KEY>"
   ```
   These values are read at runtime via `functions.config().openai.key` and `functions.config().google.api_key` in `index.js`.

## Deployment

After logging in with `firebase login` and selecting your project, deploy the function with:
```bash
firebase deploy --only functions
```
The deployed function is exposed as `api` and will handle requests to the `/api` routes described above.
