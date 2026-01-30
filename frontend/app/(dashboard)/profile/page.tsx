"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Save, User, GraduationCap, Globe, Wallet, ClipboardCheck, Check } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            router.push("/login");
            return;
        }

        fetch(`/api/profile/${userId}`)
            .then(res => res.json())
            .then(data => {
                setFormData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to load profile");
            });
    }, [router]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const userId = localStorage.getItem("user_id");
            const res = await fetch(`/api/profile/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Profile updated! Recommendations recalculated.");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (e) {
            toast.error("Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-[#25343F] font-bold animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-24 px-1">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#25343F] tracking-tight leading-tight">Profile Settings</h1>
                    <p className="text-[#BFC9D1] font-bold text-base md:text-lg mt-2">Manage your academic profile and study goals.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF9B51] text-[#25343F] rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                    <CheckCircle className="w-4 h-4" />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Academic Section */}
                <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#BFC9D1]/20 shadow-xl space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#EAEFEF] rounded-xl text-[#FF9B51]"><GraduationCap className="w-5 h-5 md:w-6 md:h-6" /></div>
                        <h3 className="font-black text-[#25343F] text-xl tracking-tight">Academic History</h3>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                className="w-full p-4 bg-[#EAEFEF]/50 border-2 border-transparent rounded-xl focus:border-[#FF9B51] focus:bg-white transition-all outline-none font-bold text-[#25343F]"
                                value={formData.full_name || ""}
                                onChange={(e) => handleChange("full_name", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-widest ml-1">Current Major</label>
                            <input
                                className="w-full p-4 bg-[#EAEFEF]/50 border-2 border-transparent rounded-xl focus:border-[#FF9B51] focus:bg-white transition-all outline-none font-bold text-[#25343F]"
                                value={formData.degree_major || ""}
                                onChange={(e) => handleChange("degree_major", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-widest ml-1">GPA / Score</label>
                                <input
                                    className="w-full p-4 bg-[#EAEFEF]/50 border-2 border-transparent rounded-xl focus:border-[#FF9B51] focus:bg-white transition-all outline-none font-bold text-[#25343F]"
                                    value={formData.gpa || ""}
                                    onChange={(e) => handleChange("gpa", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-widest ml-1">Grad Year</label>
                                <input
                                    type="number"
                                    className="w-full p-4 bg-[#EAEFEF]/50 border-2 border-transparent rounded-xl focus:border-[#FF9B51] focus:bg-white transition-all outline-none font-bold text-[#25343F]"
                                    value={formData.graduation_year || ""}
                                    onChange={(e) => handleChange("graduation_year", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Study Goals Section */}
                <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#BFC9D1]/20 shadow-xl space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#EAEFEF] rounded-xl text-[#FF9B51]"><Globe className="w-5 h-5 md:w-6 md:h-6" /></div>
                        <h3 className="font-black text-[#25343F] text-xl tracking-tight">Study Goals</h3>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-widest ml-1">Target Degree</label>
                            <select
                                className="w-full p-4 bg-[#EAEFEF]/50 border-2 border-transparent rounded-xl focus:border-[#FF9B51] focus:bg-white transition-all outline-none font-bold text-[#25343F] appearance-none"
                                value={formData.target_degree || ""}
                                onChange={(e) => handleChange("target_degree", e.target.value)}
                            >
                                <option value="Bachelors">Bachelor's</option>
                                <option value="Masters">Master's</option>
                                <option value="MBA">MBA</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-widest ml-1">Field of Interest</label>
                            <input
                                className="w-full p-4 bg-[#EAEFEF]/50 border-2 border-transparent rounded-xl focus:border-[#FF9B51] focus:bg-white transition-all outline-none font-bold text-[#25343F]"
                                value={formData.target_field || ""}
                                onChange={(e) => handleChange("target_field", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#BFC9D1] uppercase tracking-widest ml-1">Budget Range</label>
                            <select
                                className="w-full p-4 bg-[#EAEFEF]/50 border-2 border-transparent rounded-xl focus:border-[#FF9B51] focus:bg-white transition-all outline-none font-bold text-[#25343F] appearance-none"
                                value={formData.budget_range || ""}
                                onChange={(e) => handleChange("budget_range", e.target.value)}
                            >
                                <option value="< $20k">{"< $20k"}</option>
                                <option value="$20k - $40k">$20k - $40k</option>
                                <option value="$40k - $60k">$40k - $60k</option>
                                <option value="$60k+">$60k+</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
