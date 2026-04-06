import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Moon,
  Sun,
  Send,
  Copy,
  Check,
  Menu,
  X,
  Sparkles,
  Heart,
  Activity,
  Brain,
  Pill,
  Apple,
  Moon as MoonIcon,
  Droplets,
  Shield,
  Zap,
  Stethoscope,
} from 'lucide-react';

/* ============================================================
   HealthWise AI — Premium Chatbot Component
   Clinical Luxury · Production-Grade
   ============================================================ */

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Okay, I'm ready. Please let me know how I can assist you.",
      from: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    // Check system preference or localStorage
    const saved = localStorage.getItem('hw-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [textareaHeight, setTextareaHeight] = useState(24);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputContainerRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('hw-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    }
  }, [input]);

  const suggestions = [
    { text: 'Best habits for good health', icon: Heart },
    { text: 'Symptoms of common cold', icon: Activity },
    { text: 'Benefits of regular exercise', icon: Zap },
    { text: 'Healthy diet tips', icon: Apple },
    { text: 'Importance of sleep', icon: MoonIcon },
    { text: 'Stress management techniques', icon: Brain },
    { text: 'Managing mild allergies', icon: Droplets },
    { text: 'Tips for better mental well-being', icon: Shield },
    { text: 'Understanding blood pressure readings', icon: Stethoscope },
    { text: 'First aid for minor cuts', icon: Pill },
  ];

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const sendMessageToBot = useCallback(
    async (query) => {
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
          throw new Error(
            `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
          );
        }

        const data = await response.json();
        const botReply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I couldn't understand that or an error occurred during processing.";

        setMessages((prev) => [
          ...prev,
          { text: botReply, from: 'bot', timestamp: new Date() },
        ]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage =
          error.message || 'Something went wrong. Please try again later.';
        setMessages((prev) => [
          ...prev,
          { text: `Error: ${errorMessage}`, from: 'bot', timestamp: new Date() },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [API_KEY]
  );

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage = { text: input.trim(), from: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
    }
    await sendMessageToBot(currentInput);
  };

  const handleSuggestionClick = async (suggestion) => {
    const userMessage = { text: suggestion, from: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setShowSuggestions(false);
    await sendMessageToBot(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = useCallback(async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(index);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }, []);

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatBotMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/^\s*[•\-\*]\s(.*)$/gm, '<li>$1</li>')
      .replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');
  };

  return (
    <div className="hw-layout noise-overlay">
      {/* Mobile overlay */}
      {showSuggestions && (
        <div
          className="hw-overlay"
          onClick={() => setShowSuggestions(false)}
          aria-hidden="true"
        />
      )}

      {/* ============================================================
          SIDEBAR
          ============================================================ */}
      <aside
        className={`hw-sidebar ${showSuggestions ? 'hw-sidebar-open' : ''}`}
        aria-label="Suggestions panel"
      >
        <div className="hw-sidebar-inner">
          {/* Logo */}
          <div className="hw-logo stagger-1 animate-slide-left">
            <div className="hw-logo-icon">HW</div>
            <span className="hw-logo-text">
              HealthWise<span className="hw-logo-dot" />
            </span>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={() => setShowSuggestions(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              marginBottom: '16px',
              alignSelf: 'flex-end',
            }}
            aria-label="Close suggestions"
          >
            <X size={16} />
          </button>

          {/* Section label */}
          <div className="hw-section-label stagger-2 animate-slide-left">
            Quick Questions
          </div>

          {/* Suggestions */}
          <div className="hw-suggestions">
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.text)}
                  className={`hw-suggestion stagger-${i + 3} animate-slide-left`}
                  aria-label={`Ask: ${s.text}`}
                >
                  <Icon size={16} />
                  <span>{s.text}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="hw-sidebar-footer stagger-12 animate-slide-left">
            <div className="hw-powered-badge">
              <Sparkles size={12} />
              Powered by Hurairah
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================
          MAIN CHAT AREA
          ============================================================ */}
      <main className="hw-main">
        {/* Header */}
        <header className="hw-header">
          <div className="hw-header-left">
            <button
              onClick={() => setShowSuggestions(true)}
              className="hw-menu-btn"
              aria-label="Open suggestions"
            >
              <Menu size={18} />
            </button>
            <div className="hw-header-brand">
              <div className="hw-header-logo">HW</div>
              <h1 className="hw-header-title">HealthWise AI</h1>
            </div>
            <div className="hw-status">
              <span className="hw-status-dot" />
              Online
            </div>
          </div>

          {/* Theme toggle */}
          <button
            className="hw-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            role="switch"
            aria-checked={darkMode}
          >
            <div className="hw-theme-toggle-thumb">
              {darkMode ? <Moon size={14} /> : <Sun size={14} />}
            </div>
          </button>
        </header>

        {/* Messages */}
        <div className="hw-messages" aria-live="polite" aria-label="Chat messages">
          {messages.length === 0 ? (
            <div className="hw-messages-empty">
              <div className="hw-empty-icon">
                <Sparkles size={32} />
              </div>
              <h2 className="hw-empty-title">How can I help you today?</h2>
              <p className="hw-empty-subtitle">
                Ask me anything about your health. I'm here to provide helpful,
                evidence-based information.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`hw-message ${
                  msg.from === 'user' ? 'hw-message-user' : 'hw-message-bot'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <div
                  className={`hw-avatar ${
                    msg.from === 'bot' ? 'hw-avatar-bot' : 'hw-avatar-user'
                  }`}
                >
                  {msg.from === 'bot' ? 'HW' : 'You'}
                </div>

                {/* Bubble */}
                <div className="hw-bubble-wrapper">
                  <div
                    className={`hw-bubble ${
                      msg.from === 'user' ? 'hw-bubble-user' : 'hw-bubble-bot'
                    }`}
                  >
                    {msg.from === 'bot' ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatBotMessage(msg.text),
                        }}
                      />
                    ) : (
                      <span>{msg.text}</span>
                    )}

                    {/* Copy button (bot only) */}
                    {msg.from === 'bot' && (
                      <button
                        className={`hw-copy-btn ${copiedId === index ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(msg.text, index)}
                        title={copiedId === index ? 'Copied!' : 'Copy message'}
                        aria-label={
                          copiedId === index ? 'Copied to clipboard' : 'Copy message'
                        }
                      >
                        {copiedId === index ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="hw-timestamp">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="hw-typing">
              <div className="hw-avatar hw-avatar-bot">HW</div>
              <div className="hw-typing-dots">
                <span className="hw-typing-dot" />
                <span className="hw-typing-dot" />
                <span className="hw-typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="hw-input-wrapper">
          <div className="hw-input-container" ref={inputContainerRef}>
            {/* Paperclip (disabled) */}
            <button
              className="hw-input-attach"
              disabled
              aria-label="Attach file (not available)"
              tabIndex={-1}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              className="hw-input-textarea"
              placeholder="Ask me anything about your health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              aria-label="Type your health question"
            />

            {/* Send button */}
            <button
              className="hw-input-send"
              onClick={handleSend}
              disabled={loading || input.trim() === ''}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
