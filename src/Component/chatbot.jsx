import React, { useState, useRef } from 'react';
import { Moon, Sun, Send, Copy, Menu, X } from 'lucide-react'; // Import icons

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Okay, I'm ready. Please let me know how I can assist you.", from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const sendMessageToBot = async (query) => {
    setLoading(true);

    try {
      const response = await fetch(
       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that or an error occurred during processing.";

      setMessages((prev) => [...prev, { text: botReply, from: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.message || "Something went wrong. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${errorMessage}`, from: 'bot' },
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
    setShowSuggestions(false); // Close suggestions menu on mobile
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
      } h-screen flex flex-col lg:flex-row transition-colors duration-500 ease-in-out relative`}
    >
      {/* Suggestions Column - Desktop sidebar, Mobile overlay */}
      <div
        className={`
          ${showSuggestions ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:static inset-y-0 left-0 z-30 w-[85%] sm:w-[70%] lg:w-[30%] 
          p-4 sm:p-6 border-r 
          ${darkMode ? 'bg-[#1a1a1a] border-gray-700' : 'bg-gray-50 border-gray-200'} 
          flex flex-col overflow-y-auto transition-all duration-300 ease-in-out
          shadow-2xl lg:shadow-none
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setShowSuggestions(false)}
          className={`lg:hidden self-end mb-4 p-2 rounded-full ${
            darkMode ? 'bg-[#333333] hover:bg-[#444444]' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label="Close suggestions"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 tracking-wide select-none text-indigo-500">
          Health Suggestions
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left text-sm sm:text-base p-3 sm:p-4 rounded-xl shadow-md transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
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

      {/* Overlay for mobile when suggestions are open */}
      {showSuggestions && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setShowSuggestions(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full lg:w-[70%]">
        {/* Header */}
        <div
          className={`p-3 sm:p-4 lg:p-6 flex justify-between items-center ${
            darkMode ? 'bg-[#212121]' : 'bg-gray-100'
          } sticky top-0 z-10 shadow-sm transition-colors duration-500 ease-in-out`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Menu button for mobile */}
            <button
              onClick={() => setShowSuggestions(true)}
              className={`lg:hidden p-2 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? 'bg-[#212121] text-white' : 'bg-white text-black'
              }`}
              aria-label="Open suggestions menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight select-none text-indigo-600 dark:text-indigo-400">
              HealthWise AI
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 sm:p-3 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode ? 'bg-[#212121] text-white' : 'bg-white text-black'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-3 sm:space-y-5 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent"
          style={{ scrollBehavior: 'smooth' }}
          tabIndex={0}
          aria-live="polite"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`relative px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-2xl 
              max-w-[90%] sm:max-w-[85%] lg:max-w-[70%] 
              whitespace-pre-wrap break-words shadow-md transform transition duration-500 ease-in-out 
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
                className={msg.from === 'bot' ? 'prose prose-sm sm:prose-base max-w-full text-sm sm:text-base' : 'text-sm sm:text-base'}
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
                  className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-200`}
                  title="Copy to clipboard"
                  aria-label="Copy bot message to clipboard"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div
              className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-2xl 
              max-w-[90%] sm:max-w-[85%] lg:max-w-[70%] 
              text-center text-sm sm:text-base font-semibold shadow-md animate-pulse ${
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
          className={`p-3 sm:p-4 lg:p-6 border-t flex items-center gap-2 sm:gap-3 lg:gap-4 ${
            darkMode ? 'bg-[#212121] border-gray-700' : 'bg-gray-100 border-gray-300'
          } sticky bottom-0 z-10 shadow-inner transition-colors duration-500 ease-in-out`}
        >
          <input
            type="text"
            className={`flex-1 p-3 sm:p-4 rounded-2xl border border-transparent outline-none placeholder-gray-400 text-sm sm:text-base lg:text-lg font-medium shadow-md focus:ring-4 focus:ring-indigo-400 transition-all duration-300 ${
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
            className={`p-3 sm:p-4 rounded-2xl shadow-lg transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500 flex items-center justify-center ${
              darkMode
                ? 'bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-900 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white'
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5 sm:w-6 sm:h-6" />
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

          /* Styled scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          @media (min-width: 640px) {
            ::-webkit-scrollbar {
              width: 8px;
            }
          }
          ::-webkit-scrollbar-thumb {
            background-color: #6366f1; /* Indigo-500 */
            border-radius: 4px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }

          /* Ensure mobile viewport height is properly calculated */
          @supports (-webkit-touch-callout: none) {
            .h-screen {
              height: -webkit-fill-available;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Chatbot;
