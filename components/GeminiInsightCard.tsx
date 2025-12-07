import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RefreshCw,
  Send,
  Bot,
  User,
  ChevronRight,
  Loader2,
  ArrowRight,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { AIAnalysisResult, DashboardData, ChatMessage } from '../types';
import { generateDashboardAnalysis, createDataChat } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: DashboardData;
}

const GeminiInsightCard: React.FC<Props> = ({ data }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'summary' | 'details' | 'chat'>('summary');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSession = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAnalysis();
    chatSession.current = createDataChat(data);
  }, [data]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, viewMode]);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const result = await generateDashboardAnalysis(data);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatSession.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input.trim(), timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSession.current.sendMessageStream(userMsg.text);

      let fullText = '';
      setChatMessages((prev) => [
        ...prev,
        { role: 'model', text: '', timestamp: new Date() },
      ]);

      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setChatMessages((prev) => {
            if (!prev.length) return prev;
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
              ...newHistory[newHistory.length - 1],
              text: fullText,
            };
            return newHistory;
          });
        }
      }
    } catch (error) {
      console.error('Chat error', error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "I'm having trouble connecting right now.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="col-span-1 lg:col-span-3 xl:col-span-2 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-1 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] overflow-hidden relative min-h-[300px] flex flex-col">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      <div className="bg-slate-900/90 rounded-xl p-6 relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold">Gemini Intelligence</h2>
              <p className="text-slate-400 text-xs">Real-time Data Analysis</p>
            </div>
          </div>

          <div className="flex gap-2">
            {viewMode !== 'summary' && (
              <button
                onClick={() => setViewMode('summary')}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:bg-white/5 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={loadAnalysis}
              disabled={loading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 text-indigo-300"
              title="Refresh Analysis"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {/* VIEW: Loading */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-indigo-300 gap-3"
              >
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-mono animate-pulse">
                  Analyzing dashboard data...
                </span>
              </motion.div>
            )}

            {/* VIEW: Summary (Default) */}
            {!loading && analysis && viewMode === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-indigo-500 mb-4">
                  <p className="text-slate-200 text-sm leading-relaxed">{analysis.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3">
                    <div className="text-xs text-emerald-400 font-bold uppercase mb-1">Top Strength</div>
                    <div className="text-sm text-slate-200 truncate">{analysis.positiveTrends[0]}</div>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                    <div className="text-xs text-amber-400 font-bold uppercase mb-1">Opportunity</div>
                    <div className="text-sm text-slate-200 truncate">{analysis.strategicRecommendation}</div>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => setViewMode('details')}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-3 h-3" /> Full Report
                  </button>
                  <button
                    onClick={() => setViewMode('chat')}
                    className="flex-1 py-2.5 border border-indigo-500/40 text-indigo-100 hover:bg-indigo-500/10 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3 h-3" /> Ask Gemini
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW: Details */}
            {!loading && analysis && viewMode === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto pr-2 custom-scrollbar"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Positive Trends
                    </h3>
                    <ul className="space-y-2">
                      {analysis.positiveTrends.map((trend, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-300 flex items-start gap-2 bg-slate-800/30 p-2 rounded"
                        >
                          <ChevronRight className="w-4 h-4 text-emerald-500/70 mt-0.5 shrink-0" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {analysis.areasForImprovement.map((area, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-300 flex items-start gap-2 bg-slate-800/30 p-2 rounded"
                        >
                          <ChevronRight className="w-4 h-4 text-rose-500/70 mt-0.5 shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg mt-2">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Strategic Recommendation
                    </h4>
                    <p className="text-sm text-amber-100/90">{analysis.strategicRecommendation}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: Chat */}
            {viewMode === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col h-full"
              >
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 custom-scrollbar min-h-0">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-8">
                      <p>Ask me specifically about your revenue, orders, or margins.</p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-[85%] ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                            : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 items-center text-xs text-indigo-300/50 ml-8">
                      <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-slate-950/50 border border-indigo-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GeminiInsightCard;
