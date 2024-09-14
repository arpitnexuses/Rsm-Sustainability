import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
const pdfParse = require('pdf-parse');

// Ensure you handle undefined values
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Step 1: Read the PDF from the backend folder
    const filePath = path.join(process.cwd(), 'pages', 'files', 'RSMtaxes.pdf');
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);
    const fileText = pdfData.text;

    const inputValue = req.body.inputValue || '';
    const messages = req.body.messages || [];

    // Step 2: Construct the messages for OpenAI
    const systemMessage = { role: 'system', content: 'You are a helpful assistant.' };
    const userMessage = { role: 'user', content: `${fileText}\n${inputValue}` };
    const updatedMessages = [systemMessage, ...messages, userMessage];

    // Step 3: Send the messages to OpenAI for a response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: updatedMessages,
      max_tokens: 25,
      top_p: 0.9,
    });

    // Extracting the message from the response
    const messageContent = response.choices[0].message.content;

    res.status(200).json({ role: 'assistant', content: messageContent });
  } catch (error) {
    console.error('OpenAI API error:', error);

    if (error.response && error.response.status === 429) {
      res.status(429).json({ message: 'Quota exceeded. Please check your billing and plan.' });
    } else {
      res.status(500).json({ message: 'Error generating AI response' });
    }
  }
}
