"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Loader2 } from 'lucide-react';
import { useInterviewParams } from '@/hooks/useInterviewParams';
import { useRouter, useSearchParams } from 'next/navigation';

type Mode = 'selection' | 'university' | 'visa';

interface Message {
    role: 'user' | 'model';
    text: string;
}

function MockInterviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        isListening,
        isSpeaking,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        speak,
        cancelSpeech,
        error: speechError
    } = useInterviewParams();

    const [mode, setMode] = useState<Mode>('selection');
    const [history, setHistory] = useState<Message[]>([]);
    const [processing, setProcessing] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const interviewLimit = 300; // 5 minutes in seconds

    // Context Data
    const [lockedUni, setLockedUni] = useState<string | null>(null);
    const [targetCountry, setTargetCountry] = useState<string>("USA");
    const [canTakeUni, setCanTakeUni] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load status
    useEffect(() => {
        fetch('/api/interview/status')
            .then(res => res.json())
            .then(data => {
                setLockedUni(data.locked_university);
                setTargetCountry(data.target_country);
                setCanTakeUni(data.can_take_university_interview);
                setLoading(false);

                // Auto-start check
                const paramMode = searchParams.get('mode');
                if (paramMode === 'university' && data.can_take_university_interview) {
                    startSession('university');
                } else if (paramMode === 'visa') {
                    startSession('visa');
                }
            })
            .catch(err => {
                console.error("Failed to fetch status", err);
                setLoading(false);
            });
    }, [searchParams]);

    // Timer Effect
    useEffect(() => {
        let timer: any;
        if (mode === 'visa' && !loading) {
            timer = setInterval(() => {
                setElapsedSeconds(prev => {
                    if (prev >= interviewLimit) {
                        clearInterval(timer);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [mode, loading]);

    // Handle Conversation Flow
    const hasProcessedTranscript = useRef(false);

    useEffect(() => {
        if (!isListening && transcript && !processing && !hasProcessedTranscript.current) {
            handleSend(transcript);
            hasProcessedTranscript.current = true;
        }
        if (isListening) {
            hasProcessedTranscript.current = false;
        }
    }, [isListening, transcript, processing]);

    const handleSend = async (text: string) => {
        setProcessing(true);

        const newHistory = [...history, { role: 'user', text } as Message];
        setHistory(newHistory);

        try {
            const timeContext = mode === 'visa' ? ` [Time: ${Math.floor(elapsedSeconds / 60)} mins ${elapsedSeconds % 60} secs]` : '';
            const res = await fetch('/api/interview/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text + timeContext,
                    mode: mode,
                    history: newHistory.slice(-10)
                })
            });

            const data = await res.json();
            const aiResponse = data.response;

            setHistory(prev => [...prev, { role: 'model', text: aiResponse }]);

            speak(aiResponse, () => {
                if (mode !== 'selection') {
                    startListening();
                }
            });

        } catch (e) {
            console.error("Chat error", e);
        } finally {
            setProcessing(false);
        }
    };

    const startSession = (selectedMode: Mode) => {
        setMode(selectedMode);
        setHistory([]);

        let greeting = "";
        if (selectedMode === 'university') {
            const uniName = lockedUni || "your target university";
            greeting = `Hello, thank you for joining me. I am the admissions officer for ${uniName}. Shall we begin?`;
        } else {
            const country = targetCountry || "USA";
            greeting = `Good morning. Please step forward. I am the Visa Officer for ${country}. Can I see your passport?`;
        }

        setHistory([{ role: 'model', text: greeting }]);

        setTimeout(() => {
            speak(greeting, () => {
                startListening();
            });
        }, 1000);
        setElapsedSeconds(0);
    };

    const endSession = async () => {
        cancelSpeech();
        stopListening();

        const fullTranscript = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
        if (fullTranscript) {
            await fetch('/api/interview/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript: fullTranscript, mode: mode })
            });
        }

        const targetPath = mode === 'visa' ? '/visa' : '/applications';
        setMode('selection');
        router.push(targetPath);
    };

    if (mode === 'selection') {
        return (
            <div className="min-h-screen bg-[#EAEFEF] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-[#FF9B51]" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-[60]">
                {mode === 'visa' && (
                    <div className="flex items-center gap-3 bg-[#25343F]/80 backdrop-blur px-5 py-3 rounded-2xl border border-[#BFC9D1]/20">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${elapsedSeconds > 240 ? 'bg-red-500' : 'bg-[#FF9B51]'}`} />
                        <span className={`font-black text-sm tracking-widest ${elapsedSeconds > 240 ? 'text-red-500' : 'text-[#EAEFEF]'}`}>
                            {Math.floor((interviewLimit - elapsedSeconds) / 60)}:{((interviewLimit - elapsedSeconds) % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                )}
                <div className="flex-1" />
                <button
                    onClick={endSession}
                    className="p-4 bg-[#25343F]/80 backdrop-blur text-[#EAEFEF] rounded-full hover:bg-red-500 hover:rotate-90 transition-all shadow-xl border border-[#BFC9D1]/20"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="absolute top-24 uppercase tracking-[0.2em] text-sm text-zinc-500 animate-pulse">
                {processing ? "Thinking..." : isSpeaking ? "Speaking" : isListening ? "Listening" : "Paused"}
            </div>

            <div className="relative flex items-center justify-center">
                <motion.div
                    animate={
                        processing ? { scale: [1, 0.9, 1], opacity: 0.8 } :
                            isSpeaking ? { scale: [1, 1.2, 1], boxShadow: "0px 0px 50px rgba(100, 200, 255, 0.4)" } :
                                isListening ? { scale: [1, 1.1, 1], boxShadow: "0px 0px 30px rgba(255, 100, 100, 0.2)" } :
                                    { scale: 1, opacity: 0.5 }
                    }
                    transition={{ repeat: Infinity, duration: isSpeaking ? 2 : 4, ease: "easeInOut" }}
                    className={`w-64 h-64 rounded-full bg-gradient-to-br transition-colors duration-1000 blur-sm
                    ${isSpeaking ? 'from-blue-500 to-purple-600' :
                            isListening ? 'from-rose-500 to-red-600' :
                                'from-zinc-800 to-zinc-900'
                        }`}
                />

                {(isSpeaking || isListening) && (
                    <>
                        <motion.div
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                            className={`absolute w-64 h-64 rounded-full border border-opacity-20 
                            ${isSpeaking ? 'border-blue-500' : 'border-red-500'}`}
                        />
                        <motion.div
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                            className={`absolute w-64 h-64 rounded-full border border-opacity-20 
                            ${isSpeaking ? 'border-purple-500' : 'border-rose-500'}`}
                        />
                    </>
                )}
            </div>

            <div className="absolute bottom-32 w-full max-w-2xl text-center px-6">
                <AnimatePresence mode="wait">
                    {interimTranscript && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl text-zinc-400 font-light"
                        >
                            {interimTranscript}
                        </motion.p>
                    )}
                    {!interimTranscript && isSpeaking && history.length > 0 && (
                        <motion.p
                            key={history[history.length - 1].text}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl text-zinc-300 font-medium leading-relaxed"
                        >
                            {history[history.length - 1].text}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-10 flex gap-6 items-center">
                <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-6 rounded-full transition-all duration-300 ${isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/50'
                        : 'bg-white text-black hover:scale-105'
                        }`}
                >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                {speechError && (
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 w-max text-red-500 text-sm bg-red-950/50 px-3 py-1 rounded">
                        {speechError}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function MockInterviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#EAEFEF] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-[#FF9B51]" />
            </div>
        }>
            <MockInterviewContent />
        </Suspense>
    );
}
