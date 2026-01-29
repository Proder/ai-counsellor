"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, DollarSign, Award, School, Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";

export default function UniversitiesPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`/api/universities/?query=${query}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (uni: any) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        try {
            const res = await fetch("/api/universities/shortlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: parseInt(userId),
                    university_id: uni.id,
                    university_name: uni["school.name"],
                    category: "Target" // Default to Target for prototype
                }),
            });
            if (res.ok) {
                toast.success(`Added ${uni["school.name"]} to your shortlist!`);
            }
        } catch (e) {
            toast.error("Error adding to shortlist");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 pb-20 overflow-x-hidden">
            <header className="px-1">
                <h1 className="text-3xl md:text-5xl font-black text-[#25343F] tracking-tight leading-tight">University Discovery</h1>
                <p className="text-[#BFC9D1] font-bold text-base md:text-lg mt-2">Browse colleges using real-time Scorecard metrics.</p>
            </header>

            {/* Search Bar */}
            <div className="bg-[#25343F] p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 md:opacity-10 group-hover:rotate-6 transition-transform">
                    <School className="w-24 h-24 md:w-32 md:h-32 text-[#EAEFEF]" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex-1 relative group/input">
                            <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-[#BFC9D1] w-5 h-5 md:w-6 md:h-6 group-focus-within/input:text-[#FF9B51] transition-colors" />
                            <input
                                className="w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 bg-[#EAEFEF]/10 border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl text-[#EAEFEF] placeholder-[#BFC9D1]/50 focus:border-[#FF9B51] outline-none transition-all font-bold text-sm md:text-lg"
                                placeholder="Search e.g. Stanford, MIT..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="w-full px-10 py-4 md:py-5 bg-[#FF9B51] text-[#25343F] rounded-xl md:rounded-2xl font-black text-sm md:text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">SCANNING SCORECARD...</span>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    FIND MATCHES
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
                {results.map((uni) => (
                    <div key={uni.id} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-[#BFC9D1]/20 hover:border-[#FF9B51]/50 shadow-lg hover:shadow-2xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center group">
                        <div className="flex-1 min-w-0 w-full mb-6 md:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#FF9B51] bg-[#FF9B51]/10 px-3 py-1 rounded-full whitespace-nowrap">Verified Metrics</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-[#25343F] mb-3 group-hover:text-[#FF9B51] transition-colors truncate">{uni["school.name"]}</h3>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[#BFC9D1] font-bold text-xs md:text-sm">
                                <span className="flex items-center gap-2 whitespace-nowrap"><MapPin className="w-4 h-4 text-[#FF9B51] shrink-0" /> {uni["school.city"]}, {uni["school.state"]}</span>
                                <span className="flex items-center gap-2 whitespace-nowrap"><DollarSign className="w-4 h-4 text-[#FF9B51] shrink-0" /> ${uni["latest.cost.tuition.out_of_state"]?.toLocaleString() || "N/A"}</span>
                                <span className="flex items-center gap-2 whitespace-nowrap"><Award className="w-4 h-4 text-[#FF9B51] shrink-0" /> {Math.round((uni["latest.admissions.admission_rate.overall"] || 0) * 100)}% Rate</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleShortlist(uni)}
                            className="shrink-0 w-full md:w-auto px-6 py-4 bg-[#25343F] text-[#EAEFEF] rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#FF9B51] hover:text-[#25343F] transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            SHORTLIST
                        </button>
                    </div>
                ))}

                {searched && results.length === 0 && !loading && (
                    <div className="text-center py-16 md:py-24 bg-[#EAEFEF]/50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-[#BFC9D1]/30 px-6">
                        <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-[#BFC9D1] mx-auto mb-4" />
                        <p className="text-[#25343F] font-black text-lg md:text-xl">Zero results on the scorecard.</p>
                        <p className="text-[#BFC9D1] font-bold mt-2 text-sm md:text-base max-w-sm mx-auto">Our AI suggests broadening search terms or checking official prefixes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
