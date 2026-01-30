"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Lock, Unlock, List, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ShortlistPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchShortlist = async () => {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        const res = await fetch(`/api/universities/shortlist/${userId}`);
        const data = await res.json();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchShortlist();
    }, []);

    const executeLock = async (id: number) => {
        await fetch(`/api/universities/lock/${id}`, { method: "POST" });
        toast.success("University locked! Application guide unlocked.");
        fetchShortlist();
    };

    const executeUnlock = async (id: number) => {
        await fetch(`/api/universities/unlock/${id}`, { method: "POST" });
        toast.info("Admission track reset. You can now explore other institutions.");
        fetchShortlist();
    };

    const handleUnlock = (id: number) => {
        toast("Reverse Commitment?", {
            description: "Unlocking will reset your application progress for this university. Are you sure?",
            action: {
                label: "Unlock Now",
                onClick: () => executeUnlock(id),
            },
        });
    };

    const handleLock = (id: number) => {
        toast("Permanent Commitment", {
            description: "Locking will commit you to this university and unlock application guides.",
            action: {
                label: "Lock Choice",
                onClick: () => executeLock(id),
            },
        });
    };

    if (loading) return <div className="p-10 text-[#25343F] font-black uppercase tracking-widest animate-pulse">Scanning shortlist...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <header className="flex justify-between items-end mt-6 md:mt-0">
                <div>
                    <h1 className="text-4xl font-black text-[#25343F]">Decision Pipeline</h1>
                    <p className="text-[#25343F]/70 font-bold text-lg mt-2">Finalize your target institution to start the application phase.</p>
                </div>
                <div className="hidden md:flex bg-[#FF9B51]/10 border-2 border-[#FF9B51]/20 p-4 rounded-2xl items-center gap-3">
                    <Lock className="w-5 h-5 text-[#FF9B51]" />
                    <p className="text-[10px] font-black text-[#25343F] uppercase tracking-widest leading-none">Status: <br /><span className="text-[#FF9B51]">Awaiting Lock</span></p>
                </div>
            </header>

            {items.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-[#BFC9D1]/20 shadow-xl">
                    <div className="w-20 h-20 bg-[#EAEFEF] rounded-full flex items-center justify-center mx-auto mb-8">
                        <List className="w-10 h-10 text-[#BFC9D1]" />
                    </div>
                    <p className="text-[#25343F] font-black text-2xl mb-4">Your shortlist is currently empty.</p>
                    <p className="text-[#BFC9D1] font-bold mb-10 max-w-sm mx-auto">Discover universities using our Scorecard system and add them here to proceed.</p>
                    <Link href="/universities">
                        <button className="px-10 py-5 bg-[#25343F] text-[#EAEFEF] rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 mx-auto group">
                            <Search className="w-5 h-5 text-[#FF9B51]" />
                            DISCOVER UNIVERSITIES
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {items.map((item) => (
                        <div key={item.id} className={`p-8 rounded-[2.5rem] border-2 flex flex-col md:flex-row justify-between items-start md:items-center transition-all ${item.is_locked ? "bg-[#25343F] border-[#FF9B51] shadow-2xl scale-[1.02]" : "bg-white border-[#BFC9D1]/20 hover:border-[#FF9B51]/50 shadow-lg"}`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.is_locked ? "bg-[#FF9B51] text-[#25343F]" : "bg-[#EAEFEF] text-[#BFC9D1]"}`}>
                                        {item.category || "Target"}
                                    </span>
                                </div>
                                <h3 className={`text-2xl font-black mb-1 ${item.is_locked ? "text-[#EAEFEF]" : "text-[#25343F]"}`}>{item.university_name}</h3>
                                {item.is_locked && (
                                    <div className="flex items-center gap-2 mt-4 text-[#FF9B51] font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
                                        <Lock className="w-4 h-4" />
                                        Final Commitment Locked
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 md:mt-0 flex gap-4 w-full md:w-auto">
                                {item.is_locked ? (
                                    <button
                                        onClick={() => handleUnlock(item.id)}
                                        className="w-full md:w-auto px-8 py-4 bg-[#FF9B51] text-[#25343F] rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                    >
                                        <Lock className="w-4 h-4" /> UNLOCK
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLock(item.id)}
                                        className="w-full md:w-auto px-8 py-4 bg-[#25343F] text-[#EAEFEF] rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF9B51] hover:text-[#25343F] transition-all"
                                    >
                                        <Unlock className="w-4 h-4" /> COMMIT & LOCK
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
