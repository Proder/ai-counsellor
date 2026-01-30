"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, DollarSign, Award, School, Sparkles, Plus, ExternalLink, Globe, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function UniversitiesPage() {
    const router = useRouter();
    const [view, setView] = useState<"search" | "recommend">("search");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any>(null);
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

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            // In a real app, user_id would help fetch specific profile
            const res = await fetch(`/api/universities/?recommend=true`);
            const data = await res.json();
            setRecommendations(data.recommendations || {});
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch recommendations");
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch recommendations when tab is changed
    useEffect(() => {
        if (view === "recommend" && !recommendations) {
            fetchRecommendations();
        }
    }, [view]);

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

    const UniversityCard = ({ uni, category }: { uni: any, category?: string }) => (
        <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-[#BFC9D1]/20 hover:border-[#FF9B51]/50 shadow-lg hover:shadow-2xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center group relative overflow-hidden">
            {category && (
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-black uppercase tracking-widest text-[#25343F] ${category === "Dream" ? "bg-purple-100 text-purple-600" :
                    category === "Target" ? "bg-blue-100 text-blue-600" :
                        "bg-green-100 text-green-600"
                    }`}>
                    {category} Choice
                </div>
            )}

            <div className="flex-1 min-w-0 w-full mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#FF9B51] bg-[#FF9B51]/10 px-3 py-1 rounded-full">Scorecard Verified</span>
                    <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${(uni["latest.admissions.admission_rate.overall"] || 0) < 0.1 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                        }`}>
                        Risk: {(uni["latest.admissions.admission_rate.overall"] || 0) < 0.1 ? "High" : "Low/Medium"}
                    </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#25343F] mb-4 group-hover:text-[#FF9B51] transition-colors truncate">{uni["school.name"]}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#BFC9D1] font-bold text-xs md:text-sm">
                    <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest opacity-60">Location</p>
                        <p className="flex items-center gap-2 text-[#25343F] truncate"><MapPin className="w-3.5 h-3.5 text-[#FF9B51] shrink-0" /> {uni["school.city"]}, {uni["school.country"] || uni["school.state"]}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest opacity-60">Est. Tuition</p>
                        <p className="flex items-center gap-2 text-[#25343F] truncate"><DollarSign className="w-3.5 h-3.5 text-[#FF9B51] shrink-0" /> ${uni["latest.cost.tuition.out_of_state"]?.toLocaleString() || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest opacity-60">Acceptance</p>
                        <p className="flex items-center gap-2 text-[#25343F] truncate"><Award className="w-3.5 h-3.5 text-[#FF9B51] shrink-0" /> {Math.round((uni["latest.admissions.admission_rate.overall"] || 0) * 100)}%</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest opacity-60">Details</p>
                        {uni.website && (
                            <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#25343F] hover:text-[#FF9B51] transition-colors font-black truncate">
                                <Globe className="w-3.5 h-3.5 text-[#FF9B51] shrink-0" /> Visit Site
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 md:ml-8">
                <button
                    onClick={() => handleShortlist(uni)}
                    className="w-full px-6 py-4 bg-[#25343F] text-[#EAEFEF] rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#FF9B51] hover:text-[#25343F] transition-all shadow-md group-hover:scale-105"
                >
                    <Plus className="w-4 h-4" />
                    SHORTLIST
                </button>
                <button
                    onClick={() => router.push('/chat')}
                    className="w-full px-6 py-3 bg-white border-2 border-[#25343F] text-[#25343F] rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#25343F] hover:text-white transition-all shadow-sm"
                >
                    ASK AI FIT
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 pb-20 overflow-x-hidden">
            <header className="px-1 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6 md:mt-0">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#25343F] tracking-tight leading-tight">University Discovery</h1>
                    <p className="text-[#25343F]/70 font-bold text-base md:text-lg mt-2">Browse colleges using real-time Scorecard metrics.</p>
                </div>

                <div className="flex bg-[#25343F] p-1.5 rounded-xl md:rounded-2xl shrink-0 self-start md:self-auto">
                    <button
                        onClick={() => setView("search")}
                        className={`px-5 py-2.5 rounded-lg md:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === "search" ? "bg-[#FF9B51] text-[#25343F] shadow-lg" : "text-[#BFC9D1] hover:text-[#EAEFEF]"}`}
                    >
                        Search
                    </button>
                    <button
                        onClick={() => setView("recommend")}
                        className={`px-5 py-2.5 rounded-lg md:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === "recommend" ? "bg-[#FF9B51] text-[#25343F] shadow-lg" : "text-[#BFC9D1] hover:text-[#EAEFEF]"}`}
                    >
                        AI Recommended
                    </button>
                </div>
            </header>

            {view === "search" ? (
                <>
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
                                        <span className="animate-pulse">SCANNING DATABASE...</span>
                                    ) : (
                                        <>
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
                            <UniversityCard key={uni.id} uni={uni} />
                        ))}

                        {searched && results.length === 0 && !loading && (
                            <div className="text-center py-16 md:py-24 bg-[#EAEFEF]/50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-[#BFC9D1]/30 px-6">
                                <p className="text-[#25343F] font-black text-lg md:text-xl">Zero results found.</p>
                                <p className="text-[#BFC9D1] font-bold mt-2 text-sm md:text-base max-w-sm mx-auto">Our AI suggests broadening search terms or checking official prefixes.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Recommendation View */
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {!recommendations && loading && (
                        <div className="py-20 text-center animate-pulse">
                            <Sparkles className="w-12 h-12 text-[#FF9B51] mx-auto mb-4" />
                            <h3 className="text-xl font-black text-[#25343F]">GENERATING PROFILE MATCHES...</h3>
                            <p className="text-[#BFC9D1] mt-2">Analyzing GPA, preferences, and competition...</p>
                        </div>
                    )}

                    {recommendations && (
                        <>
                            {/* Dream */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-3 text-xl font-black text-[#25343F] uppercase tracking-tighter">
                                    Dream / Reach
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {recommendations.Dream.map((uni: any) => <UniversityCard key={uni.id} uni={uni} category="Dream" />)}
                                </div>
                            </div>

                            {/* Target */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-3 text-xl font-black text-[#25343F] uppercase tracking-tighter">
                                    Target Match
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {recommendations.Target.map((uni: any) => <UniversityCard key={uni.id} uni={uni} category="Target" />)}
                                </div>
                            </div>

                            {/* Safe */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-3 text-xl font-black text-[#25343F] uppercase tracking-tighter">
                                    Safety / Backup
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {recommendations.Safe.map((uni: any) => <UniversityCard key={uni.id} uni={uni} category="Safe" />)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
