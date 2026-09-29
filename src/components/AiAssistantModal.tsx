import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  AlertCircle,
  Database,
  RefreshCw,
  CheckCircle2,
  FileText,
  Users,
  Pill,
  Clock,
  ShieldAlert,
  Search,
  ChevronRight,
  ExternalLink,
  Zap,
  Settings2,
  Check,
  Copy,
  Link2,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations';
import {
  MedicineItem,
  FamilyMember,
  Reminder,
  ScanHistoryRecord,
  FakeMedicineAlert,
  SafetyAlert,
} from '../types';
import {
  buildWebsiteKnowledgeCorpus,
  queryWebsiteDataOffline,
  WebsiteDataPackage,
} from '../utils/aiKnowledgeBase';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  isDark: boolean;
  currentLang: SupportedLanguage;
  medicines?: MedicineItem[];
  familyMembers?: FamilyMember[];
  reminders?: Reminder[];
  scanHistory?: ScanHistoryRecord[];
  fakeAlerts?: FakeMedicineAlert[];
  safetyAlerts?: SafetyAlert[];
  user?: { name: string; email: string; phone?: string } | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  offlineFallback?: boolean;
  groundedOnWebsiteData?: boolean;
  source?: string;
  webhookUrl?: string;
}

type ModalViewTab = 'chat' | 'knowledge-base';
type KnowledgeCategory = 'all' | 'medicines' | 'family' | 'reminders' | 'alerts' | 'raw-corpus';

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  isDark,
  currentLang,
  medicines = [],
  familyMembers = [],
  reminders = [],
  scanHistory = [],
  fakeAlerts = [],
  safetyAlerts = [],
  user = null,
}) => {
  const t = translations[currentLang];

  const DEFAULT_WEBHOOK =
    'https://usharaniboddpalli.app.n8n.cloud/webhook/ad2848ba-569d-4430-b595-6f7090222fda/chat';
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('mediscan_n8n_webhook') || DEFAULT_WEBHOOK;
  });
  const [sessionId, setSessionId] = useState<string>(() => {
    const existing = localStorage.getItem('mediscan_chat_session');
    if (existing) return existing;
    const created = `session-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('mediscan_chat_session', created);
    return created;
  });
  const [webhookPingStatus, setWebhookPingStatus] = useState<'connected' | 'checking' | 'error' | 'idle'>('idle');
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const [activeTab, setActiveTab] = useState<ModalViewTab>('chat');
  const [knowledgeCategory, setKnowledgeCategory] = useState<KnowledgeCategory>('all');
  const [corpusSearch, setCorpusSearch] = useState('');
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const pingWebhook = async (urlToPing?: string) => {
    setWebhookPingStatus('checking');
    try {
      const res = await fetch('/api/n8n/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: urlToPing || webhookUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookPingStatus('connected');
      } else {
        setWebhookPingStatus('error');
      }
    } catch {
      setWebhookPingStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      pingWebhook();
    }
  }, [isOpen]);

  // Dynamic welcome message reflecting live website training corpus
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **MediScan AI Clinical & Healthcare Assistant**.\n\n⚡ **Powered by your n8n AI Cloud Agent Workflow** & trained on your live website database:\n• **${medicines.length} Medicines** in your cabinet (compositions, indications, batch numbers, precautions, storage & supply chain audits)\n• **${familyMembers.length} Family Health Profiles** (ages, conditions, and documented allergies)\n• **${reminders.length} Scheduled Reminders** & compliance records\n• **${fakeAlerts.length} Flagged Counterfeit Batches** & **${safetyAlerts.length} FDA Recall Notices**\n\nAsk me anything about your registered medications, family member prescriptions, allergy warnings, or counterfeit safety checks!\n\n*⚠️ Note: Educational guidance only. Consult a doctor for medical decisions.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedOnWebsiteData: true,
      source: 'n8n-agent',
      webhookUrl: DEFAULT_WEBHOOK,
    },
  ]);

  // Generate real-time knowledge corpus from current website data
  const currentCorpus = buildWebsiteKnowledgeCorpus({
    medicines,
    familyMembers,
    reminders,
    scanHistory,
    fakeAlerts,
    safetyAlerts,
    user,
  });

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendQuery(`Tell me about ${initialQuery}: uses, precautions, family assignment, and storage conditions.`);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleRetrainAgent = async () => {
    setIsRetraining(true);
    try {
      const res = await fetch('/api/agent-training-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicines,
          familyMembers,
          reminders,
          scanHistory,
          fakeAlerts,
          safetyAlerts,
          user,
        }),
      });
      if (res.ok) {
        setRetrainSuccess(true);
        setTimeout(() => setRetrainSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRetraining(false);
    }
  };

  const handleSaveWebhook = (newUrl: string) => {
    setWebhookUrl(newUrl);
    localStorage.setItem('mediscan_n8n_webhook', newUrl);
    pingWebhook(newUrl);
  };

  const handleResetSession = () => {
    const newSession = `session-${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSession);
    localStorage.setItem('mediscan_chat_session', newSession);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'ai',
        text: `Session reset! I am ready for new clinical and medicine queries with fresh conversation memory.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedOnWebsiteData: true,
        source: 'n8n-agent',
      },
    ]);
  };

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

    const contextData: WebsiteDataPackage = {
      medicines,
      familyMembers,
      reminders,
      scanHistory,
      fakeAlerts,
      safetyAlerts,
      user,
    };

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          contextData,
          sessionId,
          webhookUrl,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || queryWebsiteDataOffline(q, contextData),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        offlineFallback: data.offlineFallback,
        groundedOnWebsiteData: true,
        source: data.source || (data.reply ? 'n8n-agent' : 'website-grounding'),
        webhookUrl: data.webhookUrl || webhookUrl,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.source === 'n8n-agent') {
        setWebhookPingStatus('connected');
      }
    } catch (err) {
      // Local intelligent grounded search over full website data
      const offlineReply = queryWebsiteDataOffline(q, contextData);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: offlineReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          offlineFallback: true,
          groundedOnWebsiteData: true,
          source: 'mediscan-offline-fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const trainedPromptPills = [
    { label: 'Check Mary\'s medications & allergies', query: 'What medicines does Mary Miller take, and are there any allergy or recall risks?' },
    { label: 'Which medicines are expiring soon?', query: 'Which medicines in our cabinet are expiring in the next 30 days or already expired?' },
    { label: 'Why was Batch #FK-9999 flagged fake?', query: 'Explain the safety alert and counterfeit failure reason for Cough Syrup batch #FK-9999.' },
    { label: 'What is Robert\'s dosage schedule today?', query: 'What are Robert Miller\'s scheduled medicine reminders and dosages for today?' },
    { label: 'Check Eleanor\'s aspirin allergy safety', query: 'Does Eleanor Miller have an aspirin allergy, and what medications is she currently taking for osteoporosis?' },
    { label: 'Trace Paracetamol #GSK-98214-A supply chain', query: 'Show me the complete 5-stage supply chain traceability for Paracetamol batch GSK-98214-A.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-4xl h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">
                  {t.aiAssistant}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  Website Data Trained
                </span>
              </div>
              <p className="text-xs text-purple-100/90">
                Ground-truth intelligence on all cabinet medicines, family health profiles, reminders & recall alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRetrainAgent}
              disabled={isRetraining}
              title="Sync & Retrain AI Agent with latest website cabinet data"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer border border-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
              <span>{retrainSuccess ? 'Synced!' : 'Re-sync Data'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Chat vs Knowledge Base Inspection) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Chat Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge-base')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'knowledge-base'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Trained Website Knowledge Base</span>
              <span className="px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px]">
                {medicines.length + familyMembers.length + reminders.length + fakeAlerts.length} items
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Pill className="w-3.5 h-3.5 text-blue-500" /> {medicines.length} Medicines
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" /> {familyMembers.length} Family
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-500" /> {reminders.length} Reminders
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> {fakeAlerts.length + safetyAlerts.length} Alerts
            </span>
          </div>
        </div>

        {/* TAB 1: LIVE CHAT VIEW */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Active n8n Webhook Integration Bar */}
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shrink-0">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  n8n AI Webhook:
                </span>
                <span className="font-mono text-[11px] text-purple-700 dark:text-purple-300 truncate max-w-[200px] sm:max-w-md">
                  {webhookUrl}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => pingWebhook()}
                  disabled={webhookPingStatus === 'checking'}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                    webhookPingStatus === 'connected'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : webhookPingStatus === 'checking'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                  title="Test connection to n8n webhook"
                >
                  <RefreshCw className={`w-3 h-3 ${webhookPingStatus === 'checking' ? 'animate-spin' : ''}`} />
                  <span>
                    {webhookPingStatus === 'connected'
                      ? 'Connected'
                      : webhookPingStatus === 'checking'
                      ? 'Testing...'
                      : 'Ping Test'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(webhookUrl);
                    setCopiedWebhook(true);
                    setTimeout(() => setCopiedWebhook(false), 2000);
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 cursor-pointer"
                  title="Copy Webhook URL"
                >
                  {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setShowWebhookConfig(!showWebhookConfig)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    showWebhookConfig
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800'
                  }`}
                  title="Configure n8n Webhook & Session"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Optional Webhook Configuration & Session Panel */}
            {showWebhookConfig && (
              <div className="p-3 sm:p-4 border-b border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/30 text-xs space-y-2.5 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-purple-600" />
                    n8n Webhook URL Target
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Session ID: <code className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded">{sessionId}</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://.../webhook/.../chat"
                    className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleSaveWebhook(webhookUrl)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700 cursor-pointer"
                  >
                    Save & Ping
                  </button>
                  <button
                    onClick={handleResetSession}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 cursor-pointer"
                    title="Start fresh conversation memory session in n8n"
                  >
                    Reset Memory
                  </button>
                </div>
              </div>
            )}

            {/* Chat History Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                          : isDark
                          ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none shadow-sm'
                          : 'bg-slate-100/90 border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 gap-2">
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                            <Sparkles className="w-3 h-3" />
                            MediScan Grounding
                          </span>
                          {msg.source === 'n8n-agent' && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800/80">
                              <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              n8n Cloud Agent
                            </span>
                          )}
                        </div>
                      )}
                      <span className="ml-auto opacity-75">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 pl-11 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-500" />
                  <span>Synthesizing website clinical data & family records...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Pills Grounded on Real Website Data */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 whitespace-nowrap pl-1">
                💡 Suggested:
              </span>
              {trainedPromptPills.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(p.query)}
                  className="px-3 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:border-purple-400 whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
                  placeholder="Ask anything about medicines, batch numbers, family allergies, reminders, or safety alerts..."
                  className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
                  }`}
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuery.trim()}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINED WEBSITE KNOWLEDGE BASE INSPECTOR */}
        {activeTab === 'knowledge-base' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-900/30">
            {/* Knowledge Subcategory Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setKnowledgeCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    knowledgeCategory === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Overview & Stats
                </button>
                <button
                  onClick={() => setKnowledgeCategory('medicines')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                    knowledgeCategory === 'medicines'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  Medicines ({medicines.length})
                </button>
                <button
                  onClick={() => setKnowledgeCategory('family')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                    knowledgeCategory === 'family'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Family Profiles ({familyMembers.length})
                </button>
                <button
                  onClick={() => setKnowledgeCategory('reminders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                    knowledgeCategory === 'reminders'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Reminders ({reminders.length})
                </button>
                <button
                  onClick={() => setKnowledgeCategory('alerts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                    knowledgeCategory === 'alerts'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Alerts & Recalls ({fakeAlerts.length + safetyAlerts.length})
                </button>
                <button
                  onClick={() => setKnowledgeCategory('raw-corpus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                    knowledgeCategory === 'raw-corpus'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Raw Training Corpus
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={corpusSearch}
                  onChange={(e) => setCorpusSearch(e.target.value)}
                  placeholder="Filter training data..."
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border outline-none ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Knowledge Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Category: ALL (Overview & Stats) */}
              {knowledgeCategory === 'all' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        AI Agent Memory Status: Fully Trained & Synchronized
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        All application state—cabinet medications, generic equivalents, recall lots, family member profiles, allergies, reminder compliance, and GS1 supply-chain verification logs—are directly embedded in the AI Agent's system context.
                      </p>
                    </div>
                    <button
                      onClick={handleRetrainAgent}
                      disabled={isRetraining}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
                      <span>{retrainSuccess ? 'Corpus Synchronized!' : 'Re-sync Cabinet Data'}</span>
                    </button>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                        <span className="text-xs font-semibold">Medicines</span>
                        <Pill className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-black">{medicines.length}</div>
                      <div className="text-[11px] text-slate-500">All registered batches & uses</div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                        <span className="text-xs font-semibold">Family Profiles</span>
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-black">{familyMembers.length}</div>
                      <div className="text-[11px] text-slate-500">Allergies & chronic diseases</div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                        <span className="text-xs font-semibold">Dosage Reminders</span>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-black">{reminders.length}</div>
                      <div className="text-[11px] text-slate-500">Scheduled times & statuses</div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                        <span className="text-xs font-semibold">Safety Alerts</span>
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-black">{fakeAlerts.length + safetyAlerts.length}</div>
                      <div className="text-[11px] text-slate-500">Recalls & fake detection</div>
                    </div>
                  </div>

                  {/* Highlights from Trained Data */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Key Grounded Context Loaded in AI System:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-500" />
                          Family Allergy Matrix
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          • <strong>Alex Miller (Self)</strong>: Severe Penicillin allergy, mild asthma.<br />
                          • <strong>Mary Miller (Mother)</strong>: Sulfa drug allergy, hypertension.<br />
                          • <strong>Eleanor Miller (Grandmother)</strong>: Aspirin / Salicylates allergy.<br />
                          • <strong>Leo Miller (Child)</strong>: Peanut allergy, seasonal allergies.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                          Counterfeits & Active Recalls
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          • <strong>Lot #RC-2026</strong>: FDA recall for Aspirin 81mg due to packaging foil oxidation.<br />
                          • <strong>Batch #FK-9999</strong>: Illicit counterfeit Cough Syrup failed GS1 authenticity hash.<br />
                          • <strong>Batch #UN-7711-X</strong>: Generic Antibiotic with invalid license and hologram.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category: MEDICINES */}
              {(knowledgeCategory === 'medicines' || knowledgeCategory === 'all') && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" />
                    Registered Cabinet Medicines ({medicines.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {medicines
                      .filter((m) => !corpusSearch || m.name.toLowerCase().includes(corpusSearch.toLowerCase()) || m.genericName.toLowerCase().includes(corpusSearch.toLowerCase()) || m.batchNumber.toLowerCase().includes(corpusSearch.toLowerCase()))
                      .map((med) => (
                        <div
                          key={med.id}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-xs space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{med.name}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{med.genericName}</div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                med.verificationStatus === 'Verified'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {med.verificationStatus}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                            <div>Batch: <span className="font-mono font-medium">{med.batchNumber}</span></div>
                            <div>Expiry: <span className="font-medium">{med.expiryDate}</span></div>
                            <div>Dosage: <span className="font-medium">{med.dosage}</span></div>
                            <div>Category: <span className="font-medium">{med.category}</span></div>
                          </div>

                          <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                            <strong>Uses:</strong> {med.uses}
                          </div>

                          <div className="text-[11px] text-amber-600 dark:text-amber-400">
                            <strong>Precautions:</strong> {med.precautions}
                          </div>

                          {med.recallNotice?.isRecalled && (
                            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[10px]">
                              🚨 <strong>RECALLED:</strong> {med.recallNotice.reason}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Category: FAMILY PROFILES */}
              {(knowledgeCategory === 'family' || knowledgeCategory === 'all') && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    Family Health & Allergy Profiles ({familyMembers.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {familyMembers
                      .filter((f) => !corpusSearch || f.name.toLowerCase().includes(corpusSearch.toLowerCase()) || f.relation.toLowerCase().includes(corpusSearch.toLowerCase()))
                      .map((fm) => (
                        <div
                          key={fm.id}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">{fm.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                              {fm.relation} • {fm.age}y
                            </span>
                          </div>

                          <div className="text-[11px] space-y-1">
                            <div>
                              <strong className="text-slate-500">Allergies: </strong>
                              {fm.allergies.length > 0 ? (
                                <span className="font-bold text-rose-600 dark:text-rose-400">{fm.allergies.join(', ')}</span>
                              ) : (
                                <span className="text-slate-400">None</span>
                              )}
                            </div>
                            <div>
                              <strong className="text-slate-500">Conditions: </strong>
                              <span className="text-slate-700 dark:text-slate-300">{fm.conditions.join(', ') || 'Healthy'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Category: REMINDERS */}
              {(knowledgeCategory === 'reminders' || knowledgeCategory === 'all') && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    Scheduled Medication Reminders ({reminders.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reminders
                      .filter((r) => !corpusSearch || r.medicineName.toLowerCase().includes(corpusSearch.toLowerCase()) || r.familyMemberName.toLowerCase().includes(corpusSearch.toLowerCase()))
                      .map((rem) => (
                        <div
                          key={rem.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-xs flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900 dark:text-white">{rem.medicineName}</div>
                            <div className="text-[11px] text-slate-500">{rem.familyMemberName} • {rem.dosage}</div>
                            <div className="text-[10px] text-slate-400">Scheduled: {rem.time} ({rem.schedule})</div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              rem.status === 'Taken'
                                ? 'bg-emerald-500/15 text-emerald-600'
                                : rem.status === 'Pending'
                                ? 'bg-amber-500/15 text-amber-600'
                                : 'bg-rose-500/15 text-rose-600'
                            }`}
                          >
                            {rem.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Category: ALERTS & RECALLS */}
              {(knowledgeCategory === 'alerts' || knowledgeCategory === 'all') && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    Counterfeit Alerts & Safety Recalls ({fakeAlerts.length + safetyAlerts.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {safetyAlerts.map((sa) => (
                      <div
                        key={sa.id}
                        className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 dark:text-rose-200">{sa.title}</span>
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                            {sa.severity} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300">{sa.description}</p>
                        <div className="text-[10px] text-slate-500">
                          Batch: <span className="font-mono font-bold text-rose-700 dark:text-rose-300">{sa.batchNumber}</span> • Affected Members: {sa.affectedMembers.join(', ')}
                        </div>
                      </div>
                    ))}

                    {fakeAlerts.map((fa) => (
                      <div
                        key={fa.id}
                        className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 dark:text-amber-200">
                            Counterfeit Warning: {fa.medicineName} (Batch: {fa.batchNumber})
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold">
                            {fa.verificationStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300">{fa.reason}</p>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400">
                          <strong>Action:</strong> {fa.actionRecommended}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: RAW TRAINING CORPUS */}
              {knowledgeCategory === 'raw-corpus' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      Full Serialized Ground-Truth Training Prompt ({currentCorpus.length.toLocaleString()} characters)
                    </h4>
                    <span className="text-[11px] text-slate-400">Directly injected into AI System Instruction</span>
                  </div>
                  <pre
                    className={`p-4 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[50vh] border ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    {currentCorpus}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
