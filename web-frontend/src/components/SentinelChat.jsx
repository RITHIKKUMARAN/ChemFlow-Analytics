import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Cpu, Activity, AlertTriangle, Terminal as TerminalIcon } from 'lucide-react';
import gsap from 'gsap';
import { aiHelper } from '../utils/aiService';

export default function SentinelChat({ equipmentData }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Sentinel AI initialized. Monitoring active streams. How can I assist?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [health, setHealth] = useState({ score: 100, insights: [] });
    const [showHealthDetails, setShowHealthDetails] = useState(false);

    const messagesEndRef = useRef(null);
    const panelRef = useRef(null);

    // Initial Health Scan
    useEffect(() => {
        if (equipmentData.length > 0) {
            aiHelper.analyzeSystemHealth(equipmentData).then(setHealth);
        }
    }, [equipmentData]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        const response = await aiHelper.askChatbot(userMsg, equipmentData);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setLoading(false);
    };

    const toggleOpen = () => {
        if (!open) {
            setOpen(true);
            gsap.fromTo(panelRef.current,
                { x: 400, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        } else {
            gsap.to(panelRef.current,
                { x: 400, opacity: 0, duration: 0.3, ease: 'power3.in', onComplete: () => setOpen(false) }
            );
        }
    };

    // Health Details Modal Component
    const HealthModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-[500px] glass-panel border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 transform animate-in zoom-in-95 duration-200">
                <button
                    onClick={() => setShowHealthDetails(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <h2 className="font-display font-bold text-xl text-white tracking-wide">SYSTEM DIAGNOSTICS</h2>
                </div>

                <div className="flex items-center gap-8">
                    {/* Interior: Circular Progress */}
                    <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background Circle */}
                            <circle
                                cx="64" cy="64" r="58"
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                className="text-white/5"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="64" cy="64" r="58"
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364} // 2 * pi * 58
                                strokeDashoffset={364 - (364 * health.score) / 100}
                                strokeLinecap="round"
                                className={`${health.score > 90 ? 'text-emerald-400' : 'text-amber-400'} transition-all duration-1000 ease-out`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold font-mono text-white">{health.score}%</span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase">Optimal</span>
                        </div>
                    </div>

                    {/* Right: Insights List */}
                    <div className="flex-1 space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Analysis</h3>
                        {health.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                                <p className="text-sm text-slate-200 font-mono leading-relaxed">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-2 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>SENTINEL AI MONITORING</span>
                    <span>LAST SCAN: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Detailed Health View Modal */}
            {showHealthDetails && <HealthModal />}

            {/* Health HUD Pill - DECOUPLED (Displays Status Only) */}
            <div className="fixed bottom-6 right-24 z-50 transition-all duration-300">
                <div
                    className="glass-panel px-4 py-2 rounded-full border border-white/20 flex items-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-black/40 backdrop-blur-xl cursor-pointer hover:bg-white/10 hover:border-cyan-400/50 transition-all"
                    onClick={() => setShowHealthDetails(true)}
                >
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${health.score > 90 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-mono leading-none mb-1">SYSTEM HEALTH</span>
                        <span className="text-sm font-bold text-white font-mono leading-none">{health.score}% OPTIMAL</span>
                    </div>
                    <div className="h-6 w-px bg-white/10 mx-1" />

                    {/* Call to Action */}
                    <span className="text-[10px] text-cyan-300 font-mono font-bold tracking-wider animate-pulse">
                        CLICK FOR DIAGNOSTICS
                    </span>
                </div>
            </div>

            {/* Chat Trigger Button */}
            <button
                onClick={toggleOpen}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
                {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 animate-bounce-short" />}
            </button>

            {/* AI Panel */}
            <div
                ref={panelRef}
                className={`fixed top-24 bottom-24 right-6 w-96 z-40 flex flex-col glass-panel border border-cyan-500/30 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transform transition-transform duration-300 ${!open ? 'translate-x-[120%]' : ''}`}
                style={{ display: open ? 'flex' : 'none' }} // Replaced visibility logic with style for GSAP
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                            <Bot className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white font-display tracking-wider">SENTINEL AI</h3>
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                ONLINE
                            </span>
                        </div>
                    </div>
                    <Cpu className="w-4 h-4 text-slate-500" />
                </div>

                {/* Insights Feed */}
                <div className="p-3 bg-cyan-950/20 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Live Diagnostics</span>
                    </div>
                    <div className="space-y-1.5">
                        {health.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 font-mono bg-black/20 p-1.5 rounded border-l-2 border-cyan-500/50">
                                <TerminalIcon className="w-3 h-3 text-cyan-500 mt-0.5 shrink-0" />
                                {insight}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${msg.role === 'user'
                                    ? 'bg-cyan-600 text-white rounded-tr-sm'
                                    : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-sm'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 px-4 py-2 rounded-2xl flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Query system parameters..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
