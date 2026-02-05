"use client";

import { useEffect, useState } from "react";
import { Plane, Mic, FileText, ChevronRight, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function VisaPage() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(true);
    const [statusData, setStatusData] = useState<any>(null);
    const [selectedTranscript, setSelectedTranscript] = useState<any>(null);

    useEffect(() => {
        // Fetch Interview Status
        fetch('/api/interview/status')
            .then(res => res.json())
            .then(data => setStatusData(data))
            .catch(err => console.error(err))
            .finally(() => setStatusLoading(false));

        // Fetch Visa History
        fetch('/api/interview/history?mode=visa')
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-5xl mx-auto pb-24 px-4 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 my-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#25343F] tracking-tight leading-tight">
                        {statusData?.target_country ? `${statusData.target_country} Visa Interview` : "Visa Interview"}
                    </h1>
                    <p className="text-[#25343F]/70 font-bold text-base md:text-lg mt-2 tracking-tight">
                        Practice for your {statusData?.target_country ? `${statusData.target_country} F1/Student` : "student"} visa interview with AI.
                    </p>
                </div>
            </header>

            {/* Main Action Banner */}
            <div className="bg-[#25343F] text-[#EAEFEF] p-8 md:p-10 rounded-2xl md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between border-t-8 border-[#FF9B51] relative overflow-hidden transition-all duration-500 mb-12">
                <div className="absolute right-0 top-0 p-10 opacity-5 hidden sm:block">
                    <Plane className="w-32 h-32 md:w-40 md:h-40 rotate-[-45deg]" />
                </div>
                <div className="relative z-10 min-w-0 w-full md:text-left py-2">
                    <p className="text-[#FF9B51] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2">Current Status</p>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 uppercase truncate px-1">
                        {statusLoading ? "Loading..." : `${statusData?.target_country || "USA"} VISA`}
                    </h2>
                    <p className="text-[#BFC9D1] font-bold text-sm flex items-center md:justify-start gap-2">
                        <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                        {statusData?.locked_university ? `Application for ${statusData.locked_university}` : "Preparing for Consular Interview"}
                    </p>
                </div>
                <div className="mt-8 md:mt-0 flex flex-col items-center shrink-0">
                    <Link href="/mock-interview?mode=visa">
                        <button className="bg-[#FF9B51] text-[#25343F] px-8 py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-[#ff8f3d] transition-all shadow-lg flex items-center gap-3 active:scale-[0.98]">
                            <Mic className="w-5 h-5" />
                            START MOCK SESSION
                        </button>
                    </Link>
                </div>
            </div>

            {/* History Section */}
            <div className="mb-8">
                <h3 className="text-2xl font-black text-[#25343F] mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-zinc-400" />
                    Interview History
                </h3>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-zinc-300 w-8 h-8" /></div>
                ) : history.length === 0 ? (
                    <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400 font-bold">
                        No visa interviews taken yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedTranscript(item)}
                                className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                            >
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-[#BFC9D1] mb-1">
                                        {new Date(item.date).toLocaleDateString(undefined, { dateStyle: "long" })}
                                    </div>
                                    <div className="font-bold text-[#25343F] line-clamp-1">{item.transcript_preview}</div>
                                </div>
                                <div className="p-2 bg-zinc-50 rounded-full group-hover:bg-blue-50 transition-colors">
                                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Transcript Modal */}
            <AnimatePresence>
                {selectedTranscript && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#25343F]/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setSelectedTranscript(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-[#BFC9D1]/20"
                        >
                            <div className="p-8 border-b border-[#EAEFEF] flex justify-between items-center bg-[#F8FAFA]">
                                <div>
                                    <h3 className="font-black text-2xl text-[#25343F] tracking-tight">Interview Transcript</h3>
                                    <p className="text-sm text-[#BFC9D1] font-bold mt-1 uppercase tracking-wide">
                                        Recorded on {new Date(selectedTranscript.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedTranscript(null)}
                                    className="p-2 bg-[#EAEFEF] rounded-full hover:bg-red-50 text-[#BFC9D1] hover:text-red-500 transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto whitespace-pre-wrap font-medium text-[#25343F]/80 leading-relaxed bg-white scrollbar-hide">
                                {selectedTranscript.full_transcript}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
