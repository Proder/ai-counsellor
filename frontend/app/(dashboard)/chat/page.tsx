"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, User, Sparkles, Mic, FileUp, Zap, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string; isAction?: boolean }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial History Fetch
    useEffect(() => {
        const fetchHistory = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;

            try {
                const res = await fetch(`/api/chat/history`);
                const data = await res.json();
                if (data.length > 0) {
                    setMessages(data.map((m: any) => ({
                        role: m.role === "bot" ? "assistant" : "user",
                        content: m.text || "",
                        isAction: !!m.is_action
                    })));
                } else {
                    setMessages([{
                        role: "assistant",
                        content: "Hello! I'm your AI Counsellor. I'm here to help you with your study abroad journey. How can I help you today?"
                    }]);
                }
            } catch (e) {
                console.error("Failed to fetch history:", e);
            }
        };
        fetchHistory();
    }, [mode]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (overrideInput?: string) => {
        const msgToSend = overrideInput || input;
        if (!msgToSend.trim()) return;

        setMessages(prev => [...prev, { role: "user", content: msgToSend }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: input
                }),
            }); if (!res.ok) throw new Error("Network error");

            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.response }]);

            if (data.actions_taken && data.actions_taken.length > 0) {
                data.actions_taken.forEach((action: string) => {
                    setMessages(prev => [...prev, { role: "assistant", content: action, isAction: true }]);
                });
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered a network error. Let's try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-[#BFC9D1]/20 overflow-hidden relative">

            {/* Thinking Overlay */}
            {loading && !messages.length && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-bounce">
                        <Bot className="w-12 h-12 text-[#FF9B51]" />
                    </div>
                </div>
            )}

            {/* Chat Header */}
            <div className={`p-4 md:p-6 border-b border-[#BFC9D1]/10 bg-[#25343F] text-[#EAEFEF] transition-all duration-500 flex justify-between items-center shrink-0`}>
                <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-2 md:p-2.5 rounded-lg md:rounded-xl shrink-0 bg-[#FF9B51] text-[#25343F]`}>
                        <Bot className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-black text-base md:text-lg tracking-tight leading-tight">AI Counsellor</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 group cursor-help relative">
                        <Mic className="w-3.5 h-3.5 text-[#BFC9D1]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#BFC9D1]">Voice</span>
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#FF9B51] text-[#25343F] text-[10px] font-black py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl pointer-events-none border-b-2 border-[#25343F]/20">
                            COMING SOON!
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 group cursor-help relative">
                        <FileUp className="w-3.5 h-3.5 text-[#BFC9D1]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#BFC9D1]">Upload</span>
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#FF9B51] text-[#25343F] text-[10px] font-black py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl pointer-events-none border-b-2 border-[#25343F]/20">
                            DOC SCANNER COMING SOON!
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            {msg.role === "assistant" && !msg.isAction && (
                                <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#EAEFEF] items-center justify-center text-[#25343F] shrink-0 border border-[#BFC9D1]/20">
                                    <Bot className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            )}
                            {msg.role === "user" && (
                                <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#25343F] items-center justify-center text-[#FF9B51] shrink-0 border border-white/10">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
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
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h3: ({ node, ...props }) => (
                                                <h3 className="text-[#25343F] font-black text-xs md:text-sm uppercase tracking-[0.2em] mb-2 mt-4 first:mt-0 flex items-center gap-2 border-l-4 border-[#FF9B51] pl-3 py-1 bg-white/40 rounded-r-xl" {...props} />
                                            ),
                                            p: ({ node, ...props }) => (
                                                <p className="mb-2 last:mb-0 leading-relaxed opacity-90" {...props} />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul className="space-y-1.5 mb-3 last:mb-0" {...props} />
                                            ),
                                            li: ({ node, ...props }) => (
                                                <li className="flex items-start gap-3 bg-white/20 p-2 rounded-xl border border-white/30 backdrop-blur-sm" {...props}>
                                                    <span className="text-[#FF9B51] mt-0.5 shrink-0">•</span>
                                                    <div className="flex-1">{props.children}</div>
                                                </li>
                                            )
                                        }}
                                    >
                                        {msg.content}
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
                                Thinking...
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
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={loading}
                    />

                    <button
                        onClick={() => handleSend()}
                        disabled={loading}
                        className="px-6 md:px-8 bg-[#25343F] text-[#EAEFEF] rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center group shrink-0"
                    >
                        <Send className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#FF9B51]" />
                    </button>
                </div>

                {/* Suggestions */}
                <div className="mt-4 flex flex-wrap justify-center gap-3 md:gap-5 overflow-hidden">
                    {["Shortlist", "SOP Review", "Application Timeline", "Visa Help"].map((hint, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setInput(hint);
                                handleSend(hint);
                            }}
                            className="px-3 py-1.5 bg-white border border-[#BFC9D1]/30 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#BFC9D1] hover:text-[#25343F] hover:border-[#FF9B51] transition-all whitespace-nowrap shadow-sm"
                        >
                            {hint}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-[#BFC9D1]/20 overflow-hidden items-center justify-center">
                <div className="flex gap-3 md:gap-4 items-center">
                    <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#EAEFEF] items-center justify-center text-[#25343F] border border-[#BFC9D1]/20">
                        <Bot className="w-4 h-4 md:w-5 md:h-5 animate-bounce" />
                    </div>
                    <div className="bg-[#EAEFEF]/50 text-[#BFC9D1] px-5 py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest animate-pulse border border-[#BFC9D1]/10">
                        Loading Chat...
                    </div>
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
