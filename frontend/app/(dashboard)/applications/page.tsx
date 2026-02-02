"use client";

import { useEffect, useState } from "react";
import { Lock, CheckCircle, FileText, Calendar, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function ApplicationsPage() {
    const [lockedUnis, setLockedUnis] = useState<any[]>([]);
    const [selectedUni, setSelectedUni] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Checklist state
    const [completedDocs, setCompletedDocs] = useState<Record<number, string[]>>({});

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`/api/universities/shortlist`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const locked = data.filter((item: any) => item.is_locked);
                setLockedUnis(locked);
                if (locked.length > 0) {
                    setSelectedUni(locked[0]);
                }
            })
            .finally(() => setLoading(false));

        const saved = localStorage.getItem("app_checklist");
        if (saved) setCompletedDocs(JSON.parse(saved));
    }, []);

    const toggleDoc = (docTitle: string) => {
        if (!selectedUni) return;
        const uniId = selectedUni.id;
        const current = completedDocs[uniId] || [];
        const updated = current.includes(docTitle)
            ? current.filter(d => d !== docTitle)
            : [...current, docTitle];

        const newDocs = { ...completedDocs, [uniId]: updated };
        setCompletedDocs(newDocs);
        localStorage.setItem("app_checklist", JSON.stringify(newDocs));
    };

    if (loading) return <div className="p-10 text-[#25343F] font-black uppercase tracking-widest animate-pulse">Loading guides...</div>;

    if (lockedUnis.length === 0) {
        return (
            <div className="max-w-3xl mx-auto text-center py-12 md:py-20 px-6">
                <div className="bg-[#FF9B51]/10 w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-[#FF9B51]/30">
                    <Lock className="w-8 h-8 md:w-10 md:h-10 text-[#FF9B51]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[#25343F] mb-4 tracking-tight leading-tight">Roadmap Locked</h1>
                <p className="text-[#BFC9D1] font-bold mb-10 max-w-md mx-auto text-base md:text-lg">
                    You must finalize your target university in the shortlist before accessing your application guide.
                </p>
                <div className="flex flex-col gap-4 items-center">
                    <Link href="/universities" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#25343F] text-[#EAEFEF] rounded-xl md:rounded-2xl font-black text-sm md:text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 group">
                            <GraduationCap className="w-5 h-5 text-[#FF9B51]" />
                            UNIVERSITY DISCOVERY
                        </button>
                    </Link>
                    <Link href="/shortlist" className="text-xs font-black uppercase tracking-widest text-[#BFC9D1] hover:text-[#25343F] transition-colors">
                        GO TO SHORTLIST
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 pb-24 px-1">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-6 md:mt-0">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#25343F] tracking-tight leading-tight">Application Roadmap</h1>
                    <p className="text-[#25343F]/70 font-bold text-base md:text-lg mt-2 tracking-tight">Active tracking for your committed institutions.</p>
                </div>
            </header>

            {/* Premium Collapsible Multi-Uni Selector */}
            {lockedUnis.length > 1 && (
                <div className="relative z-50">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-full bg-white border-2 border-[#BFC9D1]/20 p-5 rounded-2xl flex items-center justify-between font-black text-[#25343F] text-xs uppercase tracking-widest hover:border-[#FF9B51] transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-[#FF9B51] shrink-0"></div>
                            <span className="truncate">Switch Institution: {selectedUni?.university_name}</span>
                        </div>
                        {isMenuOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-[#BFC9D1]/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {lockedUnis.map((uni) => (
                                <button
                                    key={uni.id}
                                    onClick={() => {
                                        setSelectedUni(uni);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left p-5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#EAEFEF] flex items-center justify-between ${selectedUni?.id === uni.id ? "bg-[#EAEFEF] text-[#FF9B51]" : "text-[#25343F]"
                                        }`}
                                >
                                    <span className="truncate mr-4">{uni.university_name}</span>
                                    {selectedUni?.id === uni.id && <CheckCircle className="w-4 h-4 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-[#25343F] text-[#EAEFEF] p-8 md:p-10 rounded-2xl md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between border-t-8 border-[#FF9B51] relative overflow-hidden transition-all duration-500">
                <div className="absolute right-0 top-0 p-10 opacity-5 hidden sm:block">
                    <GraduationCap className="w-32 h-32 md:w-40 md:h-40" />
                </div>
                <div className="relative z-10 min-w-0 w-full md:text-left py-2">
                    <p className="text-[#FF9B51] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2">Active Commitment</p>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 uppercase truncate px-1">{selectedUni?.university_name}</h2>
                    <p className="text-[#BFC9D1] font-bold text-sm flex items-center md:justify-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Application Roadmap Active
                    </p>
                </div>
                <div className="mt-8 md:mt-0 flex flex-col items-center shrink-0">
                    <div className="bg-[#FF9B51] text-[#25343F] px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-lg uppercase tracking-widest">
                        PHASE: APPLYING
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#BFC9D1]/20 shadow-xl transition-all">
                    <h3 className="text-lg md:text-xl font-black text-[#25343F] mb-6 md:mb-8 flex items-center gap-3">
                        <div className="p-2 bg-[#EAEFEF] rounded-lg md:rounded-xl text-[#FF9B51]"><FileText className="w-5 h-5 md:w-6 md:h-6" /></div>
                        Required Documents
                    </h3>
                    <ul className="space-y-3 md:space-y-4">
                        {["Statement of Purpose", "Letters of Rec (3)", "Official Transcripts", "Resume / CV", "Financial Proof"].map((item, i) => {
                            const isDone = selectedUni && completedDocs[selectedUni.id]?.includes(item);
                            return (
                                <li
                                    key={i}
                                    onClick={() => toggleDoc(item)}
                                    className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all cursor-pointer group ${isDone ? "bg-green-500/5 border-green-500/20" : "bg-[#EAEFEF]/30 border-transparent hover:border-[#FF9B51]/20"
                                        }`}
                                >
                                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${isDone ? "bg-green-500 border-green-500 text-white" : "border-[#BFC9D1] group-hover:border-[#FF9B51] bg-white"
                                        }`}>
                                        {isDone && <CheckCircle className="w-4 h-4" />}
                                    </div>
                                    <span className={`font-black text-xs md:text-sm tracking-tight transition-all ${isDone ? "text-[#BFC9D1] line-through" : "text-[#25343F]"
                                        }`}>
                                        {item}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#BFC9D1]/20 shadow-xl transition-all">
                    <h3 className="text-lg md:text-xl font-black text-[#25343F] mb-6 md:mb-8 flex items-center gap-3">
                        <div className="p-2 bg-[#EAEFEF] rounded-lg md:rounded-xl text-[#FF9B51]"><Calendar className="w-5 h-5 md:w-6 md:h-6" /></div>
                        Critical Deadlines
                    </h3>
                    <div className="space-y-4 md:space-y-6">
                        {[
                            { month: 'OCT', day: '15', label: 'Early Action Cutoff', desc: 'Final call for priority processing.', active: true },
                            { month: 'DEC', day: '01', label: 'Regular Decision', desc: 'Absolute admissions deadline.', active: false }
                        ].map((d, i) => (
                            <div key={i} className={`flex gap-4 md:gap-6 items-center p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all ${d.active ? 'bg-[#EAEFEF]/30 border-l-4 border-l-[#FF9B51] border-transparent' : 'bg-white border-[#BFC9D1]/10'}`}>
                                <div className={`${d.active ? 'bg-white' : 'bg-[#EAEFEF]'} px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-center shadow-sm shrink-0`}>
                                    <div className="text-[8px] md:text-[10px] font-black text-[#BFC9D1]">{d.month}</div>
                                    <div className="text-lg md:text-xl font-black text-[#25343F]">{d.day}</div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-black text-[#25343F] text-xs md:text-sm truncate">{d.label}</p>
                                    <p className="text-[10px] md:text-xs font-bold text-[#BFC9D1] truncate">{d.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 md:mt-10 py-4 md:py-5 bg-[#25343F] text-[#EAEFEF] rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-[#1a252d] transition-all shadow-xl uppercase tracking-widest active:scale-[0.98]">
                        ADD TO CALENDAR
                    </button>
                </div>
            </div>
        </div>
    );
}
