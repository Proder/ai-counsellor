"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Send, Bot, User, Zap, Sparkles, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string; isAction?: boolean }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        try {
            const res = await fetch(`/api/chat/history/${userId}`);
            const data = await res.json();
            if (data.length > 0) {
                setMessages(data.map((m: any) => ({
                    role: m.role,
                    text: m.text,
                    isAction: m.is_action
                })));
            } else {
                setMessages([
                    { role: "bot", text: "Hello! I'm your AI Counsellor. How can I help you plan your study abroad journey today?" }
                ]);
            }
        } catch (e) {
            console.error("Failed to fetch history:", e);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const userId = localStorage.getItem("user_id");
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: parseInt(userId || "0"), message: userMsg }),
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: "bot", text: data.response }]);

            if (data.actions_taken && data.actions_taken.length > 0) {
                data.actions_taken.forEach((action: string) => {
                    setMessages(prev => [...prev, { role: "bot", text: action, isAction: true }]);
                });
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: "bot", text: "Sorry, I encountered an inference error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-[#BFC9D1]/20 overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-[#BFC9D1]/10 bg-[#25343F] text-[#EAEFEF] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="bg-[#FF9B51] p-2 md:p-2.5 rounded-lg md:rounded-xl text-[#25343F] shrink-0">
                        <Bot className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-black text-base md:text-lg tracking-tight leading-tight">AI Counsellor</h2>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#EAEFEF]/5 rounded-full border border-[#BFC9D1]/20">
                    <Zap className="w-3 h-3 text-[#FF9B51]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#BFC9D1]">Fast Latency</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            {msg.role === "bot" && !msg.isAction && (
                                <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#EAEFEF] items-center justify-center text-[#25343F] shrink-0 border border-[#BFC9D1]/20">
                                    <Bot className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            )}
                            <div className={`p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] text-xs md:text-sm font-bold leading-relaxed shadow-sm ${msg.isAction
                                ? "bg-[#FF9B51]/10 border-2 border-dashed border-[#FF9B51] text-[#25343F] italic flex items-center gap-3"
                                : msg.role === "user"
                                    ? "bg-[#25343F] text-[#EAEFEF] rounded-tr-none shadow-xl"
                                    : "bg-[#EAEFEF]/50 text-[#25343F] rounded-tl-none border border-[#BFC9D1]/10"
                                }`}>
                                {msg.isAction && <Sparkles className="w-4 h-4 text-[#FF9B51] shrink-0" />}
                                <div className="markdown-container">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 md:gap-4 items-center">
                            <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#EAEFEF] items-center justify-center text-[#25343F] border border-[#BFC9D1]/20">
                                <Bot className="w-4 h-4 md:w-5 md:h-5 animate-bounce" />
                            </div>
                            <div className="bg-[#EAEFEF]/50 text-[#BFC9D1] px-5 py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest animate-pulse border border-[#BFC9D1]/10">
                                Running Inference...
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-[#EAEFEF]/20 border-t border-[#BFC9D1]/10 shrink-0">
                <div className="flex gap-2 md:gap-3 relative">
                    <input
                        className="flex-1 px-5 md:px-8 py-4 md:py-5 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-[#25343F] placeholder-[#BFC9D1]/50 focus:border-[#25343F] outline-none transition-all shadow-inner min-w-0"
                        placeholder="Ask anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="px-6 md:px-8 bg-[#25343F] text-[#EAEFEF] rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center group shrink-0"
                    >
                        <Send className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#FF9B51]" />
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-3 md:gap-6 overflow-hidden">
                    {["Shortlist", "GPA Review", "Application Help"].map((hint, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(hint)}
                            className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#BFC9D1] hover:text-[#25343F] flex items-center gap-1 transition-colors whitespace-nowrap"
                        >
                            <ChevronRight className="w-3 h-3 text-[#FF9B51]" />
                            {hint}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
