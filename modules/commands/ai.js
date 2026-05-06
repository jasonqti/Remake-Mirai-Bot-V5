// ai.js
import fetch from 'node-fetch';

// Replace with your OpenAI API key or set it as environment variable OPENAI_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Please set your OPENAI_API_KEY environment variable');
}

/**
 * Sends a message to GPT-4 and returns the response.
 * @param {string} userMessage - user's input message starting with 'ai'
 * @returns {Promise<string>} - GPT-4 response text
 */
async function getGPT4Response(userMessage) {
  // Ensure the message starts with 'ai '
  const prompt = userMessage.trim();

  if (!prompt.toLowerCase().startsWith('ai ')) {
    throw new Error("Message must start with 'ai '");
  }

  // Extract the actual question to send to GPT-4
  const question = prompt.slice(3).trim();
  if (!question) {
    return 'Please provide a question for GPT-4 to answer.\nExample:\nai what is the second law of motion?';
  }

  // Construct the messages payload for Chat Completion API
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: question }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error.message}`);
  }

  const data = await response.json();
  const answer = data.choices[0].message.content.trim();

  return answer;
}

/**
 * Simulate a chat bot reply function (replace with your messaging platform's event handler)
 * @param {string} inputText - input user message
 */
async function onUserMessage(inputText) {
  if (inputText.toLowerCase().startsWith('ai')) {
    // Initial prompt if only 'ai' or 'ai ' is sent
    if (inputText.trim() === 'ai') {
      return 'Please provide a question for GPT-4 to answer.\nExample:\nai what is the second law of motion?';
    }

    // Typing indicator simulation
    console.log('🗨️ | ChatGPT-4 is Thinking! Please Wait....');

    try {
      const answer = await getGPT4Response(inputText);
      return answer;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  } else {
    return null; // Not an AI command, ignore or pass to other handlers
  }
}

// Example usage (for testing purposes):
(async () => {
  const userInput = 'ai what is love?';
  const botReply = await onUserMessage(userInput);
  console.log(botReply);
})();

export { onUserMessage, getGPT4Response };
