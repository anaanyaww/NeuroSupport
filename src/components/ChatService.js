const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API with the API key
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.REACT_APP_GEMINI_API_KEY, // Use the Gemini API key from the environment variable
});

// Configure the generation parameters
const generationConfig = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 64,
  max_output_tokens: 100, // Adjust based on your use case
  response_mime_type: "text/plain",
};

// Define safety settings
const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

// Initialize the Generative Model with the appropriate configuration
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash', // Use the Gemini model of your choice
  generationConfig,
  safetySettings,
});

export const getBotResponse = async (userMessage, conversationHistory = []) => {
  console.log("User Message:", userMessage);
  console.log("Conversation History:", conversationHistory);

  // System message to encourage shorter, concise responses
  const systemMessage = {
    role: 'system',
    content: 'Please provide concise responses, ideally 2-3 sentences. For stories or longer content, break them into shorter parts and wait for the user to ask for more.'
  };

  // Construct the messages for the API call
  const messages = [
    systemMessage,
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    console.log("Making API call using Gemini SDK...");

    // Call the generate_content method to get a response from the Gemini model
    const response = await model.generateContent({
      messages: messages,
      max_tokens: 100, // Adjust as needed
    });

    console.log('Full API Response:', response);

    // Process the response
    const botResponse = response?.content || "I couldn't generate a response.";
    const cleanedResponse = botResponse
      .replace(/^\[object Object\]\s*/, '')
      .replace(/^(User|AI):?\s*/i, '')
      .trim();

    console.log('Cleaned Response:', cleanedResponse);

    if (userMessage.toLowerCase().includes('story')) {
      return cleanedResponse + " Would you like me to continue with the story?";
    }

    return cleanedResponse;
  } catch (error) {
    console.error("Error during API call:", error);
    throw new Error("Unable to generate a response at this time. Please try again later.");
  }
};
