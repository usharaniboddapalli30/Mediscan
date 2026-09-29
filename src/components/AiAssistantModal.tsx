import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  BookOpen,
  RefreshCw,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  isDark: boolean;
  currentLang: SupportedLanguage;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  offlineFallback?: boolean;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  isDark,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **MediScan AI Medicine Assistant**. Ask me general questions about medications, active ingredients, storage conditions, or common drug precautions.\n\n*⚠️ Note: I provide general educational information only and do not replace professional medical advice or physician diagnosis.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendQuery(`Tell me about ${initialQuery}: uses, precautions, and storage.`);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'I am currently unable to fetch detailed information. Please consult your healthcare provider.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        offlineFallback: data.offlineFallback,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: `Regarding "${q}":\n\n• **General Precautions**: Always verify prescribed dosage with your physician or pharmacist.\n• **Storage**: Keep medications sealed below 25°C in a dry location.\n• **Safety**: Check expiry date before consumption.\n\n*⚠️ Disclaimer: Educational information only. Does not replace professional medical advice.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    'What is Paracetamol 500mg used for?',
    'How should Amoxicillin liquid be stored?',
    'What are the common side effects of Metformin?',
    'What precautions to take with Aspirin blood thinners?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-2xl h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {t.aiAssistant}
              </h2>
              <p className="text-xs text-purple-100">
                AI Educational Medicine Information Bot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="text-[10px] opacity-60 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-500" />
              <span>Analyzing pharmacology database...</span>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 overflow-x-auto flex items-center gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q)}
              className="px-3 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 whitespace-nowrap transition-colors cursor-pointer"
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question about uses, precautions, storage..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border outline-none ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600'
              }`}
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
