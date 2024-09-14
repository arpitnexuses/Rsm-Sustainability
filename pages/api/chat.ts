import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai'; // Updated import statement
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');
// Initialize OpenAI API client
// eslint-disable-next-line @typescript-eslint/no-var-requires
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY; // Ensure you handle undefined values

});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      // Step 1: Read the PDF from the backend folder
      const filePath = path.join(process.cwd(), 'pages', 'files', 'RSMtaxes.pdf'); // Use path.join for cross-platform compatibility
      const fileBuffer = fs.readFileSync(filePath); // Read the PDF file from the server
      const pdfData = await pdfParse(fileBuffer);   // Parse the PDF content
      const fileText = pdfData.text;  // Extract the text from the PDF
  
      const inputValue = req.body.inputValue || '';  // Get any additional input from the frontend
      const messages = req.body.messages || [];      // Get any previous messages
  
      // Step 2: Construct the messages for OpenAI
      const systemMessage = { role: 'system', content: 'You are a helpful assistant.' };
      const userMessage = { role: 'user', content: `${fileText}\n${inputValue}` };
      const updatedMessages = [systemMessage, ...messages, userMessage];
  
      // Step 3: Send the messages to OpenAI for a response
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: updatedMessages,
        max_tokens: 25, // Optional: specify max tokens if needed
        top_p: 0.9,     // Optional: specify top_p if needed
      });
  
      // Extracting the message from the response
      const messageContent = response.choices[0].message.content;
  
      res.status(200).json({ role: 'assistant', content: messageContent });
    } catch (error) {
      console.error('OpenAI API error:', error);
  
      if (error.code === 'insufficient_quota') {
        res.status(429).json({ message: 'Quota exceeded. Please check your billing and plan.' });
      } else {
        res.status(500).json({ message: 'Error generating AI response' });
      }
    }
  }
