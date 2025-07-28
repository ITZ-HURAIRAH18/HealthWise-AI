import React, { useState, useRef } from 'react';
import { Moon, Sun, Send, Copy } from 'lucide-react'; // Import Copy icon

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Okay, I'm ready. Please let me know how I can assist you.", from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Added 4 more suggestions
  const [suggestions] = useState([
    "Best habits for good health",
    "Symptoms of common cold",
    "Benefits of regular exercise",
    "Healthy diet tips",
    "Importance of sleep",
    "Stress management techniques",
    "Managing mild allergies", // New suggestion 1
    "Tips for better mental well-being", // New suggestion 2
    "Understanding blood pressure readings", // New suggestion 3
    "First aid for minor cuts", // New suggestion 4
  ]);

  const messagesEndRef = useRef(null);

  // IMPORTANT: Replace with your actual API Key.
  // For production, never hardcode API keys directly in client-side code.
  // Use environment variables or a backend proxy.
  const API_KEY = "https://github.com/ITZ-HURAIRAH18/HealthWise-AI.git";

  const sendMessageToBot = async (query) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a medical assistant chatbot. Respond to the user's query in a clear, structured, and professional tone.
                            Use **bold titles** for headings. For lists, use bullet points like '• Item 1'. Ensure proper line breaks.
                            Do not confirm formatting instructions unless the user asks about them.
                            User's query: ${query}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that or an error occurred during processing.";

      setMessages((prev) => [...prev, { text: botReply, from: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Please try again later.", from: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, from: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; // Capture current input before clearing
    setInput('');
    await sendMessageToBot(currentInput);
  };

  // New handler for suggestion clicks
  const handleSuggestionClick = async (suggestion) => {
    const userMessage = { text: suggestion, from: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    await sendMessageToBot(suggestion);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // You can add a more subtle notification here instead of alert
        // For example, a temporary tooltip or toast message
        console.log('Copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy text.'); // Keep alert for error visibility
      });
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-[#212121] text-white' : 'bg-white text-black'
      } h-screen flex transition-colors duration-500 ease-in-out`}
    >
      {/* Suggestions Column (30%) */}
      <div
        className={`w-[30%] p-6 border-r ${
          darkMode ? 'bg-[#1a1a1a] border-gray-700' : 'bg-gray-50 border-gray-200'
        } flex flex-col overflow-y-auto transition-colors duration-500 ease-in-out`}
      >
        <h2 className="text-2xl font-semibold mb-6 tracking-wide select-none text-indigo-500">
          Health Suggestions
        </h2>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left p-4 rounded-xl shadow-md transform transition-transform duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                darkMode
                  ? 'bg-[#333333] hover:bg-[#444444] text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              aria-label={`Send suggestion: ${suggestion}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area (70%) */}
      <div className="flex-1 flex flex-col w-[70%]">
        {/* Header */}
        <div
          className={`p-6 flex justify-between items-center ${
            darkMode ? 'bg-[#212121]' : 'bg-gray-100'
          } sticky top-0 z-20 shadow-sm transition-colors duration-500 ease-in-out`}
        >
          <h1 className="text-3xl font-semibold tracking-tight select-none text-indigo-600 dark:text-indigo-400">
            HealthWise AI
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            // Modified className for the toggle button
            className={`p-3 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode ? 'bg-[#212121] text-white' : 'bg-white text-black'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Chat Messages */}
        {/* The overflow-y-auto will still allow manual scrolling if content exceeds height */}
        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent"
          style={{ scrollBehavior: 'smooth' }}
          tabIndex={0} // For accessibility
          aria-live="polite"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`relative px-6 py-4 rounded-2xl max-w-[70%] whitespace-pre-wrap break-words shadow-md transform transition duration-500 ease-in-out 
              animate-fade-slide ${
                msg.from === 'user'
                  ? darkMode
                    ? 'ml-auto bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-purple-900/40'
                    : 'ml-auto bg-gradient-to-r from-indigo-400 to-indigo-600 text-white shadow-indigo-600/40'
                  : darkMode
                    ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-gray-900/50'
                    : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-blue-600/50'
              }`}
              style={{ wordBreak: 'break-word' }}
            >
              <div
                className={msg.from === 'bot' ? 'prose prose-sm max-w-full' : ''}
                dangerouslySetInnerHTML={{
                  __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
                    .replace(/\n/g, '<br>') // line breaks
                    .replace(/^\s*&bull;\s(.*)$/gm, '<li>$1</li>') // custom bullets
                    .replace(
                      /<li>/g,
                      '<ul style="list-style-type: disc; margin-left: 1.5rem;"> <li>'
                    ) // open ul
                    .replace(/<\/li>(?!<li>)/g, '</li></ul>'), // close ul
                }}
              />
              {msg.from === 'bot' && (
                <button
                  onClick={() => copyToClipboard(msg.text)}
                  className={`absolute bottom-3 right-3 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-200`}
                  title="Copy to clipboard"
                  aria-label="Copy bot message to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div
              className={`px-6 py-4 rounded-2xl max-w-[70%] text-center font-semibold shadow-md animate-pulse ${
                darkMode
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-gray-900/50'
                  : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-blue-600/50'
              }`}
            >
              Typing...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div
          className={`p-6 border-t flex items-center gap-4 ${
            darkMode ? 'bg-[#212121] border-gray-700' : 'bg-gray-100 border-gray-300'
          } sticky bottom-0 z-20 shadow-inner transition-colors duration-500 ease-in-out`}
        >
          <input
            type="text"
            className={`flex-1 p-4 rounded-2xl border border-transparent outline-none placeholder-gray-400 text-lg font-medium shadow-md focus:ring-4 focus:ring-indigo-400 transition-all duration-300 ${
              darkMode
                ? 'bg-[#303030] text-white focus:ring-indigo-600'
                : 'bg-white text-gray-800 focus:ring-indigo-400'
            }`}
            placeholder="Type your medical query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Type your medical question"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`p-4 rounded-2xl shadow-lg transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500 flex items-center justify-center ${
              darkMode
                ? 'bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-900 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white'
            }`}
            aria-label="Send message"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        {/* Tailwind Custom Animations */}
        <style>{`
          @keyframes fadeSlideIn {
            0% {
              opacity: 0;
              transform: translateY(8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-slide {
            animation: fadeSlideIn 0.4s ease forwards;
          }

          /* Optional: Styled scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #6366f1; /* Indigo-500 */
            border-radius: 4px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Chatbot;
