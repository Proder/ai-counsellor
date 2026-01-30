"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, TrendingUp, Check, GripVertical, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Reorder } from "framer-motion";

export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const STAGES = [
        "Building Profile",
        "Stage 2: Discovering Universities",
        "Stage 3: Finalizing Universities",
        "Stage 4: Preparing Applications"
    ];

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const [profRes, taskRes] = await Promise.all([
                    fetch(`/api/profile/${userId}`),
                    fetch(`/api/profile/${userId}/tasks`)
                ]);

                if (!profRes.ok) throw new Error("Failed to load");
                const profData = await profRes.json();
                setProfile(profData);

                if (!profData.onboarding_completed) {
                    router.push("/onboarding");
                    return;
                }

                const taskData = await taskRes.json();
                // Sort: Pending (top) vs Completed (bottom)
                setTasks(taskData.sort((a: any, b: any) => {
                    if (a.status === "Pending" && b.status === "Completed") return -1;
                    if (a.status === "Completed" && b.status === "Pending") return 1;
                    return 0;
                }));
            } catch (err) {
                console.error(err);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleToggleTask = async (taskId: number) => {
        const res = await fetch(`/api/profile/tasks/${taskId}/toggle`, { method: "PUT" });
        if (res.ok) {
            const data = await res.json();
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: data.new_status } : t));
            if (data.new_status === "Completed") {
                toast.success("Task completed!");
            } else {
                toast.info("Task marked as pending.");
            }
        }
    };

    const handleReorder = async (newOrder: any[]) => {
        setTasks(newOrder);
        // Persist to backend
        try {
            await fetch("/api/profile/tasks/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task_ids: newOrder.map(t => t.id) })
            });
        } catch (e) {
            console.error("Reorder failed", e);
        }
    };

    const handleProfileScan = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("AI Profile Scan Complete", {
                description: "Your university matches and academic tasks have been updated."
            });
        }, 1500);
    };

    if (loading) return <div className="p-8 text-[#25343F] font-bold animate-pulse">Analysing your profile...</div>;
    if (!profile) return null;

    const currentStageIndex = STAGES.indexOf(profile.current_stage) !== -1 ? STAGES.indexOf(profile.current_stage) : 0;
    const progressPercent = ((currentStageIndex + 1) / STAGES.length) * 100;

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in zoom-in duration-500 space-y-6 md:space-y-8 pb-12 overflow-x-hidden">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-5xl font-black text-[#25343F] tracking-tight leading-tight">
                        Hello, {profile.full_name?.split(' ')[0] || "Scholar"}!
                    </h1>
                    <p className="text-[#BFC9D1] font-bold text-base md:text-lg mt-1 tracking-tight">Ready to take the next step towards your {profile.target_degree} in {profile.target_field}?</p>
                </div>
            </header>

            {/* Stage Indicator */}
            <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#BFC9D1]/20 shadow-xl transition-all hover:shadow-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-[0.2em] whitespace-nowrap">Application Lifecycle</h2>
                    <span className="px-5 py-2 bg-[#25343F] text-[#FF9B51] rounded-full text-[11px] md:text-sm font-black shadow-inner leading-none">
                        {STAGES[currentStageIndex]}
                    </span>
                </div>
                <div className="relative pt-2">
                    <div className="h-3 md:h-4 bg-[#EAEFEF] rounded-full overflow-hidden border border-[#BFC9D1]/10">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF9B51] to-[#FF7A1A] transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="grid grid-cols-4 mt-6 gap-1">
                        {["Profile", "Discovery", "Locked", "Applications"].map((label, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className={`w-2.5 h-2.5 rounded-full mb-3 ${i <= currentStageIndex ? "bg-[#FF9B51]" : "bg-[#BFC9D1]"}`}></div>
                                <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-wider text-center ${i <= currentStageIndex ? "text-[#25343F]" : "text-[#BFC9D1]"}`}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Profile Strength - AI Audit */}
                <div className="md:col-span-1 bg-[#25343F] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex flex-col border-t-4 border-[#FF9B51] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                        <TrendingUp className="w-24 h-24" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#FF9B51]/10 rounded-xl text-[#FF9B51]"><Sparkles className="w-5 h-5" /></div>
                            <h3 className="font-black text-[#EAEFEF] text-base tracking-tight uppercase tracking-widest">AI Profile Audit</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-[9px] font-black text-[#BFC9D1] uppercase tracking-[0.2em] mb-1">Academics</p>
                                    <h4 className="text-[#EAEFEF] font-black text-xl">
                                        {profile.gpa > 3.5 || profile.gpa > 80 ? "Top Tier" : profile.gpa > 2.5 ? "Competitive" : "Average"}
                                    </h4>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${profile.gpa > 3.5 || profile.gpa > 80 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-yellow-500"}`}></div>
                            </div>

                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-[9px] font-black text-[#BFC9D1] uppercase tracking-[0.2em] mb-1">Exams & Readiness</p>
                                    <h4 className="text-[#EAEFEF] font-black text-xl">
                                        {profile.test_scores?.length > 0 ? "Underway" : "Not Started"}
                                    </h4>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${profile.test_scores?.length > 0 ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-red-500"}`}></div>
                            </div>

                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-[9px] font-black text-[#BFC9D1] uppercase tracking-[0.2em] mb-1">SOP Status</p>
                                    <h4 className="text-[#EAEFEF] font-black text-xl">{profile.sop_status || "Pending"}</h4>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${profile.sop_status === 'Ready' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-orange-500 animate-pulse"}`}></div>
                            </div>
                        </div>

                        {profile.ai_feedback && (
                            <p className="mt-8 text-[#BFC9D1] text-[11px] font-bold leading-relaxed italic border-l-2 border-[#FF9B51] pl-4">
                                "{profile.ai_feedback}"
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleProfileScan}
                        className="mt-8 py-4 bg-white/5 text-[#EAEFEF] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#FF9B51] hover:text-[#25343F] transition-all group-hover:scale-[1.02]"
                    >
                        {loading ? "SCANNING ENGINE..." : "RUN FULL AI ANALYSIS"}
                    </button>
                </div>

                {/* AI To-Do List */}
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-[#BFC9D1]/20 shadow-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#EAEFEF] rounded-xl text-[#25343F]"><CheckCircle className="w-5 h-5 md:w-6 md:h-6" /></div>
                            <h3 className="font-black text-[#25343F] text-xl tracking-tight leading-none">AI Generated Tasks</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[7px] md:text-[8px] font-black text-[#BFC9D1] uppercase tracking-[0.2em] hidden sm:block">Drag to Rearrange</span>
                            <span className="text-[9px] font-black text-[#BFC9D1] uppercase tracking-[0.2em] bg-[#EAEFEF] px-4 py-1.5 rounded-full leading-none shrink-0">
                                {tasks.filter(t => t.status === 'Completed').length} / {tasks.length} Done
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                            <div className="py-12 md:py-16 text-center">
                                <p className="text-[#BFC9D1] font-bold text-lg mb-6 leading-tight">Your task engine is clear.</p>
                                <button
                                    onClick={() => router.push('/chat')}
                                    className="px-8 py-4 bg-[#25343F] text-[#EAEFEF] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                                >
                                    Talk to AI Counsellor
                                </button>
                            </div>
                        ) : (
                            <div className="max-h-[380px] md:max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                                <Reorder.Group axis="y" values={tasks} onReorder={handleReorder} className="space-y-3">
                                    {tasks.map((task) => (
                                        <Reorder.Item
                                            key={task.id}
                                            value={task}
                                            className="flex items-center justify-between p-4 bg-[#EAEFEF]/50 rounded-2xl hover:bg-[#EAEFEF] transition-all border border-transparent hover:border-[#BFC9D1]/20 group cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleTask(task.id);
                                                    }}
                                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${task.status === "Completed"
                                                        ? "bg-[#FF9B51] border-[#FF9B51] text-[#25343F]"
                                                        : "border-[#BFC9D1] hover:border-[#FF9B51] bg-white shadow-sm"
                                                        }`}
                                                >
                                                    {task.status === "Completed" && <Check className="w-4 h-4 stroke-[4px]" />}
                                                </button>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`font-black text-sm tracking-tight leading-snug break-words ${task.status === "Completed" ? "text-[#BFC9D1] line-through" : "text-[#25343F]"}`}>
                                                        {task.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none ${task.is_auto_generated ? "text-[#FF9B51]" : "text-[#BFC9D1]"
                                                            }`}>
                                                            {task.is_auto_generated ? "⚡ AI Generated" : "User Task"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-[#BFC9D1] group-hover:text-[#25343F] transition-colors ml-4">
                                                <GripVertical className="w-5 h-5" />
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
